import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import { Shield } from 'lucide-react';

export default async function AdminPage() {
  const session = await auth();

  // Security check: Only allow ADMIN role
  // In a real app, you'd also check the database if the session role is untrusted
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch Stats in parallel
  const [totalUsers, totalListings, openDisputes, payments] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.dispute.count({ where: { status: 'OPEN' } }),
    prisma.payment.findMany({ select: { platformFee: true } }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + (p.platformFee || 0), 0);

  // Fetch Recent Bookings
  const recentBookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      renter: { select: { firstName: true, lastName: true, email: true } },
      listing: { select: { title: true } },
    }
  });

  // Fetch Users
  const allUsers = await prisma.user.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-brand-500" />
              <span className="text-sm font-semibold text-brand-600">Admin Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">Platform Administration</h1>
            <p className="text-gray-500 text-sm mt-1">Manage the Halifax & Dartmouth hybrid tool marketplace.</p>
          </div>

          <AdminDashboardClient 
            stats={{ 
              totalUsers, 
              totalListings, 
              totalRevenue, 
              openDisputes 
            }}
            recentBookings={recentBookings}
            allUsers={allUsers}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
