import Link from 'next/link';
import { Star, MapPin, Truck, Calendar, Shield, ShieldCheck, Zap, Heart, Share2, ChevronRight, MessageSquare, Clock, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/listings/ToolCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { conditionLabels, conditionColors, ToolCondition } from '@/lib/types';
import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import BookingSidebar from '@/components/listings/BookingSidebar';

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const listingResult = await prisma.listing.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      brand: true,
      model: true,
      condition: true,
      pricePerDay: true,
      pricePerWeek: true,
      pricePerHour: true,
      allowHourly: true,
      depositAmount: true,
      deliveryOption: true,
      deliveryFee: true,
      instantBook: true,
      isOfficial: true,
      images: true,
      avgRating: true,
      totalRentals: true,
      categoryId: true,
      latitude: true,
      longitude: true,
      deliveryRadiusKm: true,
      lender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          avgRatingAsLender: true,
          totalRentals: true,
          email: true,
        },
      },
      category: true,
    }
  });

  if (!listingResult) {
    notFound();
  }

  // Cast to any for the template to avoid complex type intersection issues
  const listing = listingResult as any;

  const similar = await prisma.listing.findMany({
    where: { 
      categoryId: listing.categoryId,
      id: { not: listing.id },
      isApproved: true,
      isAvailable: true,
    },
    take: 4,
    select: {
      id: true,
      slug: true,
      title: true,
      brand: true,
      model: true,
      condition: true,
      pricePerDay: true,
      pricePerWeek: true,
      images: true,
      instantBook: true,
      isOfficial: true,
      avgRating: true,
      totalRentals: true,
      deliveryOption: true,
      deliveryFee: true,
      lender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          avgRatingAsLender: true,
          totalRentals: true,
        }
      },
      category: true,
    }
  });

  const gradients = ['from-brand-400 to-brand-600','from-blue-400 to-blue-600','from-emerald-400 to-emerald-600','from-purple-400 to-purple-600','from-rose-400 to-rose-600','from-amber-400 to-amber-600','from-cyan-400 to-cyan-600','from-indigo-400 to-indigo-600'];
  const gradient = gradients[parseInt(listing.id.substring(listing.id.length - 1), 16) % gradients.length || 0];

  return (
    <>
      <Header />
      <main className="pt-20">
        <div className="section-padding py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/tools" className="hover:text-brand-600">Tools</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-dark-900 font-medium truncate">{listing.title}</span>
          </nav>
        </div>

        <div className="section-padding pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={cn('absolute inset-0 bg-gradient-to-br flex items-center justify-center', gradient)}>
                    <div className="text-white/20 text-[120px] font-bold">{listing.brand?.charAt(0) || 'T'}</div>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"><Heart className="w-5 h-5 text-gray-700" /></button>
                  <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"><Share2 className="w-5 h-5 text-gray-700" /></button>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {listing.instantBook && <span className="badge bg-brand-500 text-white shadow-lg text-sm px-3 py-1"><Zap className="w-3.5 h-3.5" />Instant Book</span>}
                  {listing.isOfficial && <span className="badge bg-indigo-600 text-white shadow-lg text-sm px-3 py-1"><ShieldCheck className="w-3.5 h-3.5" />ToolDrop Official</span>}
                  <span className={cn('badge shadow-lg text-sm px-3 py-1', conditionColors[listing.condition as ToolCondition])}>
                    {conditionLabels[listing.condition as ToolCondition]}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-2">{listing.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {listing.brand && <span>{listing.brand}{listing.model ? ` · ${listing.model}` : ''}</span>}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-dark-900">{listing.avgRating || 'New'}</span>
                    <span>({listing.totalRentals} rentals)</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-dark-900 mb-3">About this tool</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-dark-900 mb-3">Specifications</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: listing.category.name || 'N/A' },
                    { label: 'Condition', value: conditionLabels[listing.condition as ToolCondition] || 'N/A' },
                    { label: 'Brand', value: listing.brand || 'N/A' },
                    { label: 'Model', value: listing.model || 'N/A' },
                    { label: 'Min Rental', value: '1 day' },
                    { label: 'Deposit', value: `$${listing.depositAmount}` }
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-medium text-dark-900 capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Alex M.', rating: 5, date: '2 weeks ago', comment: 'Great tool, worked perfectly for my deck project. Super responsive lender.' },
                    { name: 'Priya S.', rating: 5, date: '1 month ago', comment: 'Exactly as described. Clean, well-maintained, battery lasted all day.' },
                    { name: 'Tom B.', rating: 4, date: '2 months ago', comment: 'Good condition, fair price. Pickup was easy.' }
                  ].map((review, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">{review.name.charAt(0)}</div>
                          <span className="text-sm font-medium text-dark-900">{review.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">{Array.from({ length: 5 }).map((_, j) => (<Star key={j} className={cn('w-3.5 h-3.5', j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} />))}</div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <BookingSidebar listing={listing} />

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                      {listing.lender.firstName?.charAt(0) || listing.lender.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-dark-900">
                        {listing.lender.firstName && listing.lender.lastName 
                          ? `${listing.lender.firstName} ${listing.lender.lastName}` 
                          : listing.lender.firstName || listing.lender.email.split('@')[0]}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{listing.lender.avgRatingAsLender || '0.0'}</span>
                        <span>· {listing.lender.totalRentals} rentals</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500"><Check className="w-4 h-4 text-green-500" /><span>Identity verified</span></div>
                    <div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="w-4 h-4 text-brand-500" /><span>Responds within 1 hour</span></div>
                  </div>
                  <Link href="/contact" className="btn-secondary w-full flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4" />Contact Support</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">Similar Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((l) => (
                <ToolCard key={l.id} listing={l as any} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
