'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

/**
 * Update the status of a booking (Admin only)
 */
export async function updateBookingStatus(bookingId: string, status: string) {
  const session = await auth();
  
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

/**
 * Update listing details directly (Admin only)
 */
export async function updateListingDetails(listingId: string, data: any) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        title: data.title,
        description: data.description,
        pricePerDay: parseFloat(data.pricePerDay),
        pricePerHour: data.pricePerHour ? parseFloat(data.pricePerHour) : null,
      },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('updateListingDetails error:', error);
    throw new Error('Failed to update listing details');
  }
}

/**
 * Bulk import listings assigned to the Admin user (Official tools)
 */
export async function bulkImportListings(listingsData: any[]) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  try {
    const adminId = session.user.id;
    if (!adminId) throw new Error('Admin user ID not found');

    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
    const defaultCategoryId = categories[0]?.id;

    const createPromises = listingsData.map(data => {
      const categoryId = categoryMap.get(data.category?.toLowerCase()) || defaultCategoryId;
      const slug = (data.title || 'tool').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
      
      return prisma.listing.create({
        data: {
          title: data.title,
          slug: slug,
          description: data.description || 'Professional tool available for rental.',
          pricePerDay: parseFloat(data.pricePerDay) || 0,
          pricePerHour: data.pricePerHour ? parseFloat(data.pricePerHour) : null,
          allowHourly: !!data.pricePerHour || data.allowhourly === 'true',
          condition: 'EXCELLENT',
          latitude: 44.6488, 
          longitude: -63.5752,
          deliveryFee: data.deliveryfee ? parseFloat(data.deliveryfee) : 10, // Default $10 delivery
          deliveryOption: 'BOTH',
          depositAmount: 0, // Admin tools have 0 deposit by default
          isApproved: true,
          isOfficial: true,
          lenderId: adminId,
          categoryId: categoryId,
          images: data.imageUrl ? [data.imageUrl] : ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop'],
        }
      });
    });

    await Promise.all(createPromises);

    revalidatePath('/admin');
    return { success: true, count: listingsData.length };
  } catch (error: any) {
    console.error('bulkImportListings error:', error);
    throw new Error(`Bulk import failed: ${error.message}`);
  }
}