'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { sendBookingRequestEmail } from '@/lib/mail';
import { notifyLenderOfBooking } from '@/lib/sms';

export async function createBooking(data: {
  listingId: string;
  startDate: string;
  endDate?: string;
  hours?: number;
  mode: 'daily' | 'hourly';
  delivery: boolean;
  protection: boolean;
  paymentIntentId: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  const userId = session.user.id;

  // 1. Fetch the listing and parties
  const [listing, renter, lender] = await Promise.all([
    prisma.listing.findUnique({ where: { id: data.listingId } }),
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.user.findFirst({ 
      where: { listings: { some: { id: data.listingId } } } 
    }),
  ]);

  if (!listing || !lender || !renter) {
    throw new Error('Listing or parties not found');
  }

  // 2. Re-calculate pricing (Server-side source of truth)
  const start = new Date(data.startDate);
  let subtotal = 0;
  let diffDays = 0;
  let end = start;

  if (data.mode === 'daily' && data.endDate) {
    end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    subtotal = listing.pricePerDay * diffDays;
  } else if (data.mode === 'hourly' && data.hours) {
    const hourlyRate = (listing as any).pricePerHour || listing.pricePerDay / 8;
    subtotal = hourlyRate * data.hours;
    // For hourly, we don't set a hard end date until pickup, but we can set an estimate
    end = new Date(start.getTime() + data.hours * 60 * 60 * 1000);
  }
  
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
        renterId: userId,
        lenderId: (listing as any).lenderId,
        listingId: listing.id,
        status: 'CONFIRMED',
        startDate: start,
        endDate: end,
        totalDays: data.mode === 'daily' ? diffDays : null,
        totalHours: data.mode === 'hourly' ? data.hours : null,
        pricePerDay: data.mode === 'daily' ? listing.pricePerDay : null,
        pricePerHour: data.mode === 'hourly' ? ((listing as any).pricePerHour || listing.pricePerDay / 8) : null,
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
        renterId: userId,
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
      lender.firstName || 'Neighbor', 
      renter.firstName || 'Neighbor', 
      listing.title
    ),
    lender.phone ? notifyLenderOfBooking(
      lender.phone,
      renter.firstName || 'Neighbor',
      listing.title
    ) : Promise.resolve()
  ]).catch(console.error);

  revalidatePath('/dashboard');
  revalidatePath(`/tools/${listing.slug}`);
  
  return { success: true, bookingId: result.id };
}

/**
 * Lender confirms the tool has been picked up.
 * This starts the countdown timer for hourly rentals.
 */
export async function confirmPickup(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { listing: true }
  });

  if (!booking || booking.lenderId !== session.user.id) {
    throw new Error('Booking not found or unauthorized');
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      pickedUpAt: new Date(),
      status: 'ACTIVATED'
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/lender');
  
  return { success: true, pickedUpAt: result.pickedUpAt };
}

/**
 * Lender confirms the tool has been returned.
 * This stops the countdown timer.
 */
export async function confirmReturn(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.lenderId !== session.user.id) {
    throw new Error('Booking not found or unauthorized');
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      actualReturnAt: new Date(),
      status: 'COMPLETED'
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/lender');
  
  return { success: true, returnedAt: result.actualReturnAt };
}
