import { redirect } from 'next/navigation';
import { prisma } from '@repo/db';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect(`/login?callbackUrl=/checkout/${id}`);
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      lender: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    }
  });

  if (!listing) {
    redirect('/tools');
  }

  // Prevent renting own tools
  if (listing.lenderId === session.user.id) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">You cannot rent your own tool</h1>
            <Link href="/tools" className="btn-primary">Browse other tools</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Pass minimal serializable listing data
  const serializedListing = {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    brand: listing.brand,
    model: listing.model,
    pricePerDay: listing.pricePerDay,
    depositAmount: listing.depositAmount,
    deliveryFee: listing.deliveryFee,
    deliveryOption: listing.deliveryOption,
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8 max-w-5xl mx-auto">
          <Link href={`/tools/${listing.slug}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-8 w-max">
            <ArrowLeft className="w-4 h-4" />
            Back to listing
          </Link>
          
          <CheckoutFlow listing={serializedListing} />
        </div>
      </main>
      <Footer />
    </>
  );
}
