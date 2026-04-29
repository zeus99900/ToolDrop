import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import Header from '@/components/layout/Header';
import { CreditCard, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { onboardLender, getStripeDashboardLink } from '@/lib/actions/stripe';
import { redirect } from 'next/navigation';

export default async function LenderSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  const isOnboarded = !!user?.stripeAccountId;

  const handleOnboard = async () => {
    'use server';
    const { url } = await onboardLender();
    redirect(url);
  };

  const handleDashboard = async () => {
    'use server';
    const { url } = await getStripeDashboardLink();
    redirect(url);
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-gray-50/50">
        <div className="section-padding max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-dark-900 mb-8">Lender Settings</h1>

          <div className="space-y-6">
            {/* Payouts Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-dark-900">Payouts & Earnings</h2>
                    <p className="text-sm text-gray-500">Manage how you get paid for your tool rentals</p>
                  </div>
                </div>
                {isOnboarded ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Setup Required
                  </span>
                )}
              </div>

              <div className="p-6">
                {!isOnboarded ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      To start earning money on ToolDrop, you need to connect a bank account or debit card through Stripe. 
                      Stripe is our secure payment partner used by millions of businesses.
                    </p>
                    <form action={handleOnboard}>
                      <button className="btn-primary w-full flex items-center justify-center gap-2 !py-4">
                        Connect with Stripe
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-600">
                        Your Stripe Express account is connected! Your earnings will be automatically sent to your bank account 
                        according to your payout schedule.
                      </p>
                    </div>
                    <form action={handleDashboard}>
                      <button className="btn-secondary w-full flex items-center justify-center gap-2 !py-4">
                        View Stripe Dashboard
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Other settings can go here */}
          </div>
        </div>
      </main>
    </>
  );
}
