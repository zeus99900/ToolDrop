'use client';

import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { Listing } from '@/lib/types';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

interface ToolsMapProps {
  listings: any[];
  center?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 44.6488,
  lng: -63.5752,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function ToolsMap({ listings, center }: ToolsMapProps) {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center || defaultCenter}
      options={options}
    >
      {listings.map((listing) => (
        <MarkerF
          key={listing.id}
          position={{ lat: listing.latitude, lng: listing.longitude }}
          onClick={() => setSelected(listing)}
          icon={{
            url: '/map-pin-brand.svg', // We should create this or use a default
            scaledSize: new window.google.maps.Size(32, 32),
          }}
        />
      ))}

      {selected && (
        <InfoWindowF
          position={{ lat: selected.latitude, lng: selected.longitude }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="p-1 max-w-[200px]">
            <img 
              src={selected.images[0] || '/tools/placeholder.jpg'} 
              alt={selected.title}
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
            <h3 className="font-bold text-sm text-dark-900 truncate">{selected.title}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{selected.lender.avgRatingAsLender || '5.0'}</span>
              <span>·</span>
              <span className="font-bold text-brand-600">${selected.pricePerDay}/day</span>
            </div>
            <Link 
              href={`/tools/${selected.slug}`}
              className="block mt-2 w-full text-center py-1.5 bg-brand-600 text-white text-xs font-bold rounded-md hover:bg-brand-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
