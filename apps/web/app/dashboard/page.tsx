import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UserDashboardClient from '@/components/dashboard/UserDashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch bookings for the logged-in user
  const rentals = await prisma.booking.findMany({
    where: { renterId: session.user.id },
    include: {
      listing: { select: { title: true, slug: true } },
      lender: { select: { firstName: true, lastName: true, avatarUrl: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">My Rentals</h1>
            <p className="text-gray-500 mt-1">Track your active and past tool rentals in Halifax & Dartmouth.</p>
          </div>

          <UserDashboardClient rentals={rentals} />
        </div>
      </main>
      <Footer />
    </>
  );
}
