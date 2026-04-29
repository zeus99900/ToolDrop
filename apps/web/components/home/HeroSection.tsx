'use client';

import { Search, MapPin, ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationInput from '@/components/ui/LocationInput';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (address) params.set('location', address);
    if (coordinates) {
      params.set('lat', coordinates.lat.toString());
      params.set('lng', coordinates.lng.toString());
    }
    
    router.push(`/tools?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" id="hero-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-[15%] w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Content */}
      <div className="relative section-padding w-full pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Now available in Halifax & Dartmouth</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-fade-in stagger-1">
            Rent Any Tool.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-brand-300 to-amber-300">
              Delivered Today.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-fade-in stagger-2 leading-relaxed">
            Rent premium tools directly from ToolDrop, or find deals from locals in your area. Power tools, hand tools, 
            garden equipment — delivered to your door or picked up nearby.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto animate-fade-in stagger-3">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-2xl shadow-black/20">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What tool do you need?"
                  suppressHydrationWarning
                  className="flex-1 bg-transparent text-dark-900 placeholder:text-gray-400 text-base outline-none"
                  id="hero-search-input"
                />
              </div>
              <div className="hidden sm:block border-l border-gray-200">
                <LocationInput
                  onLocationSelect={(addr, lat, lng) => {
                    setAddress(addr);
                    setCoordinates({ lat, lng });
                  }}
                  defaultValue={address}
                  placeholder="Your location"
                />
              </div>
              <button
                type="submit"
                suppressHydrationWarning
                className="btn-primary !rounded-xl !px-8 !py-3.5 text-base"
                id="hero-search-button"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-white/40">Popular:</span>
              {['Impact Driver', 'Circular Saw', 'Drill', 'Ladder', 'Pressure Washer'].map((term) => (
                <button
                  key={term}
                  suppressHydrationWarning
                  onClick={() => router.push(`/tools?q=${encodeURIComponent(term)}`)}
                  className="px-3 py-1 text-sm text-white/60 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-2xl mx-auto animate-fade-in stagger-4">
            {[
              { icon: Shield, label: 'Deposit Protection', desc: 'Funds held safely' },
              { icon: Truck, label: 'Same-Day Delivery', desc: 'Get tools fast' },
              { icon: Clock, label: 'Flexible Rentals', desc: 'Daily or weekly' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 text-left sm:flex-col sm:text-center">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 33.3C840 36.7 960 43.3 1080 45C1200 46.7 1320 43.3 1380 41.7L1440 40V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
