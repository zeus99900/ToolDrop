import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserListings, getLenderBookings } from '@/lib/data';
import { prisma } from '@repo/db';
import LenderDashboardClient from '@/components/dashboard/LenderDashboardClient';

export default async function LenderDashboard() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/lender');
  }

  const userId = session.user.id;
  const [listings, bookings, user] = await Promise.all([
    getUserListings(userId),
    getLenderBookings(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { avgRatingAsLender: true } }),
  ]);

  // Calculate some basic stats
  const activeRentals = bookings.filter((b: any) => b.status === 'ACTIVE').length;
  const monthlyEarnings = bookings
    .filter((b: any) => b.status === 'COMPLETED' || b.status === 'ACTIVE')
    .reduce((acc: number, b: any) => acc + (b.totalCharged || 0), 0);
  
  const stats = {
    monthlyEarnings,
    activeRentals,
    pendingPayout: 0,
    avgRating: user?.avgRatingAsLender || 0,
  };

  return (
    <LenderDashboardClient 
      listings={listings} 
      bookings={bookings} 
      stats={stats} 
    />
  );
}
