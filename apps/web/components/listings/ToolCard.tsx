'use client';

import Link from 'next/link';
import { Star, MapPin, Zap, Truck, Heart, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { conditionLabels, conditionColors } from '@/lib/types';
import type { Listing, User, Category } from '@repo/db';

export type ListingWithRelations = Listing & {
  lender: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl' | 'avgRatingAsLender' | 'totalRentals'>;
  category: Category;
  distance?: number | null;
};

interface ToolCardProps {
  listing: ListingWithRelations;
  className?: string;
  featured?: boolean;
}

export default function ToolCard({ listing, className, featured }: ToolCardProps) {
  const conditionLabel = conditionLabels[listing.condition];
  const conditionColor = conditionColors[listing.condition];

  // Generate a consistent gradient placeholder based on the listing id
  const gradients = [
    'from-brand-400 to-brand-600',
    'from-blue-400 to-blue-600',
    'from-emerald-400 to-emerald-600',
    'from-purple-400 to-purple-600',
    'from-rose-400 to-rose-600',
    'from-amber-400 to-amber-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
  ];
  const gradient = gradients[parseInt(listing.id) % gradients.length];

  return (
    <Link
      href={`/tools/${listing.slug}`}
      className={cn(
        'group block bg-white rounded-card overflow-hidden border border-gray-100 card-hover',
        featured && 'ring-2 ring-brand-500/20',
        className
      )}
      id={`tool-card-${listing.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn(
            'absolute inset-0 bg-gradient-to-br flex items-center justify-center',
            gradient
          )}>
            <div className="text-white/30 text-6xl font-bold uppercase">
              {listing.brand?.charAt(0) || listing.title.charAt(0) || 'T'}
            </div>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.instantBook && (
            <span className="badge bg-brand-500 text-white shadow-lg">
              <Zap className="w-3 h-3" />
              Instant
            </span>
          )}
          {listing.isOfficial && (
            <span className="badge bg-indigo-600 text-white shadow-lg">
              <ShieldCheck className="w-3 h-3" />
              ToolDrop Official
            </span>
          )}
          {featured && (
            <span className="badge bg-dark-900 text-white shadow-lg">
              Featured
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all"
          aria-label="Save listing"
        >
          <Heart className="w-4 h-4 text-gray-600" />
        </button>

        {/* Condition badge */}
        <div className="absolute bottom-3 left-3">
          <span className={cn('badge shadow-sm', conditionColor)}>
            {conditionLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-dark-900 text-sm leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
            {listing.title}
          </h3>
        </div>

        {listing.brand && (
          <p className="text-xs text-gray-400 mb-2">{listing.brand}{listing.model ? ` ${listing.model}` : ''}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          {listing.avgRating ? (
            <>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-dark-900">{listing.avgRating}</span>
              <span className="text-xs text-gray-400">({listing.totalRentals} rentals)</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">New listing</span>
          )}
        </div>

          {listing.distance !== undefined && listing.distance !== null && (
            <div className="flex items-center gap-1 text-xs text-brand-600 font-medium mb-3 bg-brand-50 px-2 py-0.5 rounded-full w-fit">
              <MapPin className="w-3 h-3" />
              <span>{listing.distance < 1 ? 'Under 1 km away' : `${listing.distance.toFixed(1)} km away`}</span>
            </div>
          )}

          {listing.deliveryOption !== 'PICKUP_ONLY' ? (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Truck className="w-3 h-3 text-brand-500" />
              <span>Delivery available</span>
              {listing.deliveryFee && (
                <span className="text-gray-400">· ${listing.deliveryFee.toFixed(2)}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>Pickup only</span>
            </div>
          )}

        {/* Price */}
        <div className="flex items-baseline gap-1 pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-dark-900">${listing.pricePerDay}</span>
          <span className="text-sm text-gray-400">/day</span>
          {listing.pricePerWeek && (
            <span className="text-xs text-gray-400 ml-auto">
              ${listing.pricePerWeek}/wk
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
