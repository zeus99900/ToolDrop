'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { sendBookingRequestEmail } from '@/lib/mail';
import { notifyLenderOfBooking } from '@/lib/sms';

export async function createBooking(data: {
  listingId: string;
  startDate: string;
  endDate: string;
  delivery: boolean;
  protection: boolean;
  paymentIntentId: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // 1. Fetch the listing and parties
  const [listing, renter, lender] = await Promise.all([
    prisma.listing.findUnique({ where: { id: data.listingId } }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.user.findFirst({ 
      where: { listings: { some: { id: data.listingId } } } 
    }),
  ]);

  if (!listing || !lender || !renter) {
    throw new Error('Listing or parties not found');
  }

  // 2. Re-calculate pricing (Server-side source of truth)
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  const subtotal = listing.pricePerDay * diffDays;
  
  const renterFeePercent = parseFloat(process.env.RENTER_FEE_PERCENT || '10');
  const lenderFeePercent = parseFloat(process.env.LENDER_FEE_PERCENT || '15');
  
  const serviceFee = subtotal * (renterFeePercent / 100);
  const lenderFee = subtotal * (lenderFeePercent / 100);
  const deliveryFee = data.delivery ? (listing.deliveryFee || 0) : 0;
  const protectionFee = data.protection ? (subtotal * 0.15) : 0;
  
  const totalCharged = subtotal + serviceFee + deliveryFee + protectionFee + listing.depositAmount;
  const lenderPayout = subtotal - lenderFee + deliveryFee;
  const platformFee = serviceFee + lenderFee + protectionFee;

  // 3. Create records in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        renterId: session.user.id,
        lenderId: listing.lenderId,
        listingId: listing.id,
        status: 'CONFIRMED',
        startDate: start,
        endDate: end,
        totalDays: diffDays,
        pricePerDay: listing.pricePerDay,
        subtotal,
        platformFee: platformFee, // Total platform take
        deliveryFee,
        damageProtectionFee: protectionFee,
        depositAmount: listing.depositAmount,
        totalCharged: totalCharged,
        isDelivery: data.delivery,
        damageProtection: data.protection,
      },
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        renterId: session.user.id,
        lenderId: listing.lenderId,
        stripePaymentIntentId: data.paymentIntentId,
        amount: totalCharged,
        depositAmount: listing.depositAmount,
        platformFee: platformFee,
        lenderPayout: lenderPayout,
        status: 'HELD',
        currency: 'CAD',
      },
    });

    // Block off availability
    let currentDate = new Date(start);
    while (currentDate <= end) {
      await tx.availability.upsert({
        where: {
          listingId_date: {
            listingId: listing.id,
            date: new Date(currentDate),
          }
        },
        update: {
          isBlocked: true,
          bookingId: booking.id,
          reason: 'BOOKED',
        },
        create: {
          listingId: listing.id,
          date: new Date(currentDate),
          isBlocked: true,
          bookingId: booking.id,
          reason: 'BOOKED',
        }
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return booking;
  });

  // Send notifications (async)
  Promise.all([
    sendBookingRequestEmail(
      lender.email, 
      lender.firstName, 
      renter.firstName, 
      listing.title
    ),
    lender.phone ? notifyLenderOfBooking(
      lender.phone,
      renter.firstName,
      listing.title
    ) : Promise.resolve()
  ]).catch(console.error);

  revalidatePath('/dashboard');
  revalidatePath(`/tools/${listing.slug}`);
  
  return { success: true, bookingId: result.id };
}
