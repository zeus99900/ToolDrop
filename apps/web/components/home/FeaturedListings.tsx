import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ToolCard from '@/components/listings/ToolCard';
import { getFeaturedListings } from '@/lib/data';

export default async function FeaturedListings() {
  const listings = await getFeaturedListings();
  return (
    <section className="py-20 bg-gray-50/50" id="featured-listings">
      <div className="section-padding">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-3">
              Available Near You
            </h2>
            <p className="text-gray-500">
              Popular tools ready for rent in your area
            </p>
          </div>
          <Link
            href="/tools"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {listings.map((listing: any, i: number) => (
            <ToolCard
              key={listing.id}
              listing={listing}
              featured={i === 0}
            />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/tools"
            className="btn-secondary"
          >
            View all tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
