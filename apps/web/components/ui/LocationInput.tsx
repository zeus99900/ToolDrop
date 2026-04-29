'use client';

import { useState, useEffect, useRef } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void;
  defaultValue?: string;
  placeholder?: string;
}

export default function LocationInput({ 
  onLocationSelect, 
  defaultValue = '', 
  placeholder = "Enter tool's location..." 
}: LocationInputProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'ca' }, // Restrict to Canada for ToolDrop
    },
    debounce: 300,
    defaultValue,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onLocationSelect(description, lat, lng);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <MapPin className="h-4 w-4 text-gray-400" />
        </div>
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-dark-900 disabled:opacity-50"
        />
      </div>

      {status === "OK" && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {data.map(({ place_id, description }) => (
            <li key={place_id}>
              <button
                onClick={() => handleSelect(description)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-start gap-2"
              >
                <MapPin className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                <span>{description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
