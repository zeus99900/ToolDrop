import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51MockStripeSecretKeyForToolDrop123';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-02-24.acacia',
});

import { generalApiLimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const { success } = await generalApiLimit.limit(session.user.id);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const { listingId, startDate, endDate, delivery, protection } = body;

    if (!listingId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the listing from the database
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // 2. Calculate the exact pricing on the server to prevent client-side manipulation
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate difference in days (adding 1 because same-day is 1 day rental)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Subtotal
    const subtotal = listing.pricePerDay * diffDays;
    
    // Fees
    const renterFeePercent = parseFloat(process.env.RENTER_FEE_PERCENT || '10');
    const serviceFee = subtotal * (renterFeePercent / 100);
    const deliveryFee = delivery ? (listing.deliveryFee || 0) : 0;
    const protectionFee = protection ? (subtotal * 0.15) : 0; 
    
    // Total (including deposit which is held)
    const totalAmount = subtotal + serviceFee + deliveryFee + protectionFee + listing.depositAmount;
    
    // Stripe requires amounts in the smallest currency unit (e.g., cents for CAD/USD)
    const amountInCents = Math.round(totalAmount * 100);

    // 3. Fetch lender to get their Stripe Connect ID
    const lender = await prisma.user.findUnique({
      where: { id: listing.lenderId },
      select: { stripeConnectId: true }
    });

    let clientSecret = 'pi_mock_123_secret_mock456';
    const isMockMode = stripeKey.includes('MockStripeSecretKey');

    if (!isMockMode) {
      // 4. Calculate Platform Fee in cents
      const lenderFeePercent = parseFloat(process.env.LENDER_FEE_PERCENT || '15');
      const lenderPayout = subtotal - (subtotal * (lenderFeePercent / 100)) + deliveryFee;
      const platformFee = totalAmount - lenderPayout; // Includes service fee, lender fee, protection fee, and deposit (initially)
      
      const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
        amount: amountInCents,
        currency: 'cad',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          listingId,
          renterId: session.user.id,
          startDate,
          endDate,
          delivery: delivery ? 'true' : 'false',
          protection: protection ? 'true' : 'false',
        },
      };

      // 5. If lender is onboarded, split the payment
      if (lender?.stripeConnectId) {
        paymentIntentOptions.application_fee_amount = Math.round(platformFee * 100);
        paymentIntentOptions.transfer_data = {
          destination: lender.stripeConnectId,
        };
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
      clientSecret = paymentIntent.client_secret as string;
    }

    return NextResponse.json({
      clientSecret,
      isMockMode,
      pricing: {
        subtotal,
        serviceFee,
        deliveryFee,
        protectionFee,
        deposit: listing.depositAmount,
        total: totalAmount,
        days: diffDays,
      }
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating payment intent' },
      { status: 500 }
    );
  }
}
