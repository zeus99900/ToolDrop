'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

/**
 * Update the status of a booking (Admin only)
 */
export async function updateBookingStatus(bookingId: string, status: string) {
  const session = await auth();
  
  // Security check: Only admins can perform this action
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: status as any 
      },
    });

    // If marked as COMPLETED or CANCELLED, we should ideally release the calendar blocks
    // For now, we'll just revalidate the admin path
    revalidatePath('/admin');
    
    return { success: true, status: updatedBooking.status };
  } catch (error) {
    console.error('Admin updateBookingStatus error:', error);
    throw new Error('Failed to update booking status');
  }
}

/**
 * Approve or Reject a listing (Admin only)
 */
export async function updateListingStatus(listingId: string, isApproved: boolean) {
  const session = await auth();
  
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.listing.update({
      where: { id: listingId },
      data: { isApproved },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    throw new Error('Failed to update listing status');
  }
}

/**
 * Delete a listing permanently (Admin only)
 */
export async function deleteListing(listingId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    // Delete related records first if needed, but Prisma schema has onCascade for many
    await prisma.listing.delete({
      where: { id: listingId },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('deleteListing error:', error);
    throw new Error('Failed to delete listing');
  }
}

/**
 * Update user account status (Admin only)
 */
export async function updateUserStatus(userId: string, status: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    throw new Error('Failed to update user status');
  }
}

/**
 * Delete a user and their data (Admin only)
 */
export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}
