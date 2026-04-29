'use server';

import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@repo/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { sendBookingConfirmationEmail, sendNewMessageEmail } from '@/lib/mail';
import { notifyUserOfMessage } from '@/lib/sms';
import { generalApiLimit, sensitiveActionLimit } from './ratelimit';
import { headers } from 'next/headers';

// ---------- Schemas ----------
const createListingSchema = z.object({
  title: z.string().min(5).max(60),
  category: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(['LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR']),
  description: z.string().min(50).max(2000),
  pricePerDay: z.number().positive(),
  pricePerWeek: z.number().positive().optional(),
  deposit: z.number().positive(),
  deliveryOption: z.enum(['BOTH', 'PICKUP_ONLY', 'DELIVERY_ONLY']),
  deliveryFee: z.number().nonnegative().optional(),
  instantBook: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
});

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

// ---------- Helper: Generate URL-safe slug ----------
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}

// ---------- Server Actions ----------

/**
 * Create a new tool listing.
 * Writes to DB and sets status to pending review.
 */
export async function createListing(formData: z.infer<typeof createListingSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to create a listing.' };
  }

  // Rate limiting
  const { success } = await generalApiLimit.limit(session.user.id);
  if (!success) {
    return { success: false, error: 'Too many requests. Please wait a minute before creating another listing.' };
  }

  const parsed = createListingSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Look up the category by slug
  const category = await prisma.category.findUnique({ where: { slug: data.category } });
  if (!category) {
    return { success: false, error: { category: ['Invalid category'] } };
  }

  const slug = generateSlug(data.title);

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      brand: data.brand || null,
      model: data.model || null,
      condition: data.condition as any,
      pricePerDay: data.pricePerDay,
      pricePerWeek: data.pricePerWeek || null,
      depositAmount: data.deposit,
      deliveryOption: data.deliveryOption as any,
      deliveryFee: data.deliveryFee || null,
      instantBook: data.instantBook,
      images: data.images || [],
      latitude: data.latitude,
      longitude: data.longitude,
      lenderId: session.user.id,
      categoryId: category.id,
      isApproved: false, // Needs admin review
      isAvailable: true,
    },
  });

  // Update user role to BOTH or LENDER if they were just a RENTER
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user && user.role === 'RENTER') {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: 'BOTH' },
    });
  }

  revalidatePath('/lender');
  revalidatePath('/tools');
  
  return { success: true, listingId: listing.id, slug: listing.slug };
}

/**
 * Register a new user.
 */
export async function registerUser(formData: z.infer<typeof signupSchema>) {
  // Rate limiting by IP for registration
  const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await sensitiveActionLimit.limit(ip);
  if (!success) {
    return { success: false, error: 'Too many registration attempts. Please try again later.' };
  }
  const parsed = signupSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { email, password, firstName, lastName } = parsed.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: { email: ['Email is already in use.'] } };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        role: 'RENTER',
        status: 'ACTIVE',
      },
    });

    return { success: true };
  } catch (err) {
    console.error('Error creating user:', err);
    return { success: false, error: 'Internal server error while creating user' };
  }
}

/**
 * Send a message in a conversation.
 * Creates the message in the DB and returns it.
 */
export async function sendMessage(conversationId: string, text: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  
  // Rate limiting
  const { success } = await generalApiLimit.limit(session.user.id);
  if (!success) {
    return { success: false, error: 'Messaging too fast. Please slow down.' };
  }
  
  if (!text.trim()) return { success: false, error: 'Message cannot be empty' };

  // Verify user is a participant in this conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: session.user.id } },
    },
  });

  if (!conversation) {
    return { success: false, error: 'Conversation not found' };
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content: text.trim(),
    },
  });

  // Update conversation updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Create a notification for the other participant
  const otherParticipants = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (otherParticipants) {
    for (const participant of otherParticipants.participants) {
      if (participant.id !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: participant.id,
            type: 'MESSAGE_RECEIVED',
            title: `New message from ${session.user.name || 'a user'}`,
            body: text.trim().substring(0, 100),
          },
        });

        // Send notifications (async)
        Promise.all([
          sendNewMessageEmail(
            participant.email,
            participant.firstName || 'Neighbor',
            session.user.name || 'A user',
            text.trim().substring(0, 50) + '...'
          ),
          participant.phone ? notifyUserOfMessage(
            participant.phone,
            session.user.name || 'A user',
            text.trim()
          ) : Promise.resolve()
        ]).catch(console.error);
      }
    }
  }

  revalidatePath('/messages');
  return { success: true, messageId: message.id };
}

/**
 * Accept or decline a booking as a lender.
 */
export async function respondToBooking(bookingId: string, action: 'ACCEPT' | 'DECLINE') {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify the booking belongs to this lender
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      lenderId: session.user.id,
    },
    include: { 
      listing: true,
      renter: true 
    },
  });

  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  const newStatus = action === 'ACCEPT' ? 'CONFIRMED' : 'CANCELLED';

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: newStatus as any,
      confirmedAt: action === 'ACCEPT' ? new Date() : undefined,
      cancelledAt: action === 'DECLINE' ? new Date() : undefined,
      cancelledBy: action === 'DECLINE' ? session.user.id : undefined,
      cancellationReason: action === 'DECLINE' ? 'Declined by lender' : undefined,
    },
  });

  // Notify the renter
  await prisma.notification.create({
    data: {
      userId: booking.renterId,
      type: action === 'ACCEPT' ? 'BOOKING_CONFIRMED' : 'BOOKING_CANCELLED',
      title: action === 'ACCEPT'
        ? `Booking confirmed for ${booking.listing?.title}`
        : `Booking declined for ${booking.listing?.title}`,
      body: action === 'ACCEPT'
        ? 'The lender has confirmed your booking. Get ready to pick up your tool!'
        : 'Unfortunately, the lender has declined your booking request.',
    },
  });

  // If accepted, send confirmation email (async)
  if (action === 'ACCEPT') {
    sendBookingConfirmationEmail(
      booking.renter.email,
      booking.renter.firstName || 'Neighbor',
      booking.listing?.title || 'your rental'
    ).catch(console.error);
  }

  revalidatePath('/lender');
  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Submit a review for a completed rental.
 */
export async function submitReview(bookingId: string, rating: number, comment: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }
  
  if (rating < 1 || rating > 5) return { success: false, error: 'Rating must be 1-5' };
  if (!comment.trim()) return { success: false, error: 'Comment is required' };

  // Verify booking exists and user is the renter
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      renterId: session.user.id,
      status: 'COMPLETED',
    },
    include: { listing: true },
  });

  if (!booking) {
    return { success: false, error: 'Booking not found or not eligible for review' };
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId_reviewerId: {
        bookingId,
        reviewerId: session.user.id,
      },
    },
  });

  if (existingReview) {
    return { success: false, error: 'You have already reviewed this rental' };
  }

  await prisma.review.create({
    data: {
      bookingId,
      reviewerId: session.user.id,
      revieweeId: booking.lenderId,
      listingId: booking.listingId,
      rating,
      comment: comment.trim(),
      isForLender: true,
    },
  });

  // Notify the lender
  await prisma.notification.create({
    data: {
      userId: booking.lenderId,
      type: 'REVIEW_RECEIVED',
      title: `New ${rating}-star review!`,
      body: `${session.user.name || 'A renter'} left a review: "${comment.trim().substring(0, 80)}"`,
    },
  });

  revalidatePath('/lender');
  return { success: true };
}
