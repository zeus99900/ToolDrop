'use client';

import { useState } from 'react';
import { LayoutGrid, Map as MapIcon, Search } from 'lucide-react';
import ToolCard from '@/components/listings/ToolCard';
import ToolsMap from './ToolsMap';
import { cn } from '@/lib/utils';

interface ToolsClientProps {
  listings: any[];
  userCoordinates?: { lat: number; lng: number };
}

export default function ToolsClient({ listings, userCoordinates }: ToolsClientProps) {
  const [view, setView] = useState<'grid' | 'map'>('grid');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-dark-900">{listings.length}</span> tools found
          {userCoordinates && <span className="ml-1 text-xs text-brand-600">Sorted by distance</span>}
        </p>

        <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setView('grid')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              view === 'grid' ? "bg-brand-50 text-brand-700 shadow-sm" : "text-gray-500 hover:text-dark-900"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setView('map')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              view === 'map' ? "bg-brand-50 text-brand-700 shadow-sm" : "text-gray-500 hover:text-dark-900"
            )}
          >
            <MapIcon className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {listings.map((listing: any) => (
            <ToolCard key={listing.id} listing={listing} />
          ))}
          {listings.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-900 mb-2">No tools found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white relative">
          <ToolsMap listings={listings} center={userCoordinates} />
        </div>
      )}
    </div>
  );
}
