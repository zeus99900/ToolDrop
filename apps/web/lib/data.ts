import { prisma } from '@repo/db';

/**
 * Fetch featured listings for the homepage.
 */
export async function getFeaturedListings(limit = 8) {
  try {
    const listings = await prisma.listing.findMany({
        where: {
          isApproved: true,
          isAvailable: true,
        },
        take: limit,
        include: {
          lender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              avgRatingAsLender: true,
              totalRentals: true,
            },
          },
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return JSON.parse(JSON.stringify(listings));
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return [];
  }
}

/**
 * Fetch listings based on search and filter parameters.
 */
export async function getListings({
  query = '',
  category = '',
  sort = 'relevance',
  userLat,
  userLng,
}: {
  query?: string;
  category?: string;
  sort?: string;
  userLat?: number;
  userLng?: number;
}) {
  try {
    const whereClause: any = {
      isApproved: true,
      isAvailable: true,
    };

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    
    if (sort === 'price_asc') {
      orderBy = { pricePerDay: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { pricePerDay: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      orderBy,
      include: {
        lender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            avgRatingAsLender: true,
            totalRentals: true,
          },
        },
        category: true,
      },
    });

    // Calculate distance if user coordinates provided
    let results = listings.map((listing: any) => {
      if (userLat && userLng && listing.latitude && listing.longitude) {
        const R = 6371; // Earth's radius in km
        const dLat = (listing.latitude - userLat) * (Math.PI / 180);
        const dLon = (listing.longitude - userLng) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * (Math.PI / 180)) * Math.cos(listing.latitude * (Math.PI / 180)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...listing, distance: R * c };
      }
      return { ...listing, distance: null };
    });

    // Sort by distance if requested
    if (sort === 'distance' && userLat && userLng) {
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sort === 'rating') {
      results.sort((a, b) => (b.lender.avgRatingAsLender || 0) - (a.lender.avgRatingAsLender || 0));
    }

    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

/**
 * Fetch all categories with their listing counts.
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { listings: true }
          }
        },
      orderBy: {
        name: 'asc'
      }
    });
    
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch listings owned by a specific user.
 */
export async function getUserListings(userId: string) {
  const listings = await prisma.listing.findMany({
    where: { lenderId: userId },
    include: {
      category: true,
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return JSON.parse(JSON.stringify(listings));
}

/**
 * Fetch bookings made by a specific user (as a renter).
 */
export async function getUserBookings(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { renterId: userId },
    include: {
      listing: {
        include: {
          category: true
        }
      },
      lender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return JSON.parse(JSON.stringify(bookings));
}

/**
 * Fetch bookings for tools owned by a specific user (as a lender).
 */
export async function getLenderBookings(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { listing: { lenderId: userId } },
    include: {
      listing: true,
      renter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          avgRatingAsRenter: true,
          totalRentals: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return JSON.parse(JSON.stringify(bookings));
}

/**
 * Fetch notifications for a specific user.
 */
export async function getUserNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  return JSON.parse(JSON.stringify(notifications));
}

/**
 * Fetch message conversations for a specific user.
 */
export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { id: userId }
      }
    },
    include: {
      participants: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true
        }
      },
      booking: {
        include: {
          listing: true
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });
  return JSON.parse(JSON.stringify(conversations));
}
