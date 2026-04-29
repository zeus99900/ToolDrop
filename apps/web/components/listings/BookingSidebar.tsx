'use client';

import { useState, useMemo } from 'react';
import { Calendar, Truck, MapPin, Shield, Zap, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface BookingSidebarProps {
  listing: any;
}

export default function BookingSidebar({ listing }: BookingSidebarProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'daily' | 'hourly'>(listing.allowHourly ? 'hourly' : 'daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hours, setHours] = useState(3);
  const [delivery, setDelivery] = useState(false);
  const [protection, setProtection] = useState(true);

  const stats = useMemo(() => {
    if (mode === 'daily') {
      if (!startDate || !endDate) return null;
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) return null;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const subtotal = listing.pricePerDay * diffDays;
      const serviceFee = subtotal * 0.1;
      const protectionFee = protection ? (subtotal * 0.15) : 0;
      const deliveryFee = delivery ? (listing.deliveryFee || 0) : 0;
      return {
        days: diffDays,
        subtotal,
        serviceFee,
        protectionFee,
        deliveryFee,
        total: subtotal + serviceFee + protectionFee + deliveryFee + listing.depositAmount
      };
    } else {
      // Hourly mode
      if (!startDate) return null;
      const subtotal = (listing.pricePerHour || listing.pricePerDay / 8) * hours;
      const serviceFee = subtotal * 0.1;
      const protectionFee = protection ? (subtotal * 0.15) : 0;
      const deliveryFee = delivery ? (listing.deliveryFee || 0) : 0;
      return {
        hours,
        subtotal,
        serviceFee,
        protectionFee,
        deliveryFee,
        total: subtotal + serviceFee + protectionFee + deliveryFee + listing.depositAmount
      };
    }
  }, [mode, startDate, endDate, hours, protection, delivery, listing]);

  const handleBook = () => {
    if (!stats) return;
    const params = new URLSearchParams({
      startDate,
      endDate: mode === 'daily' ? endDate : '',
      hours: mode === 'hourly' ? hours.toString() : '',
      delivery: delivery.toString(),
      protection: protection.toString(),
      mode
    });
    router.push(`/checkout/${listing.id}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold text-dark-900">${mode === 'daily' ? listing.pricePerDay : (listing.pricePerHour || (listing.pricePerDay / 8).toFixed(2))}</span>
        <span className="text-gray-400">/{mode === 'daily' ? 'day' : 'hr'}</span>
      </div>
      
      {/* Mode Toggle */}
      {listing.allowHourly && (
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 mt-4">
          <button 
            onClick={() => setMode('hourly')}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
              mode === 'hourly' ? "bg-white text-brand-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Hourly
          </button>
          <button 
            onClick={() => setMode('daily')}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
              mode === 'daily' ? "bg-white text-brand-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Daily
          </button>
        </div>
      )}

      {mode === 'daily' ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Start date</label>
            <input 
              type="date" 
              className="input-field !py-2 !px-3 text-sm" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">End date</label>
            <input 
              type="date" 
              className="input-field !py-2 !px-3 text-sm" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pickup Date</label>
            <input 
              type="date" 
              className="input-field !py-2 !px-3 text-sm" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Duration (Hours)</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="1" 
                max="48" 
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <span className="text-sm font-bold text-dark-900 w-12 text-right">{hours}h</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Timer starts at pickup. Max 48h.</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setDelivery(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
            delivery 
              ? "bg-brand-50 text-brand-700 border-2 border-brand-200" 
              : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
          )}
        >
          <Truck className="w-4 h-4" />Delivery
        </button>
        <button 
          onClick={() => setDelivery(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
            !delivery 
              ? "bg-brand-50 text-brand-700 border-2 border-brand-200" 
              : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
          )}
        >
          <MapPin className="w-4 h-4" />Pickup
        </button>
      </div>

      <label className={cn(
        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-6 transition-colors",
        protection ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"
      )}>
        <input 
          type="checkbox" 
          checked={protection}
          onChange={(e) => setProtection(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" 
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-dark-900 flex items-center gap-1">
            <Shield className={cn("w-3.5 h-3.5", protection ? "text-emerald-600" : "text-gray-400")} />
            Damage Protection
          </p>
          <p className="text-xs text-gray-500">Covers up to $500</p>
        </div>
      </label>

      {stats && (
        <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {mode === 'daily' 
                ? `$${listing.pricePerDay} × ${stats.days} days` 
                : `$${(listing.pricePerHour || listing.pricePerDay / 8).toFixed(2)} × ${stats.hours} hours`}
            </span>
            <span className="text-dark-900 font-medium">${stats.subtotal.toFixed(2)}</span>
          </div>
          {delivery && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery fee</span>
              <span className="text-dark-900 font-medium">${stats.deliveryFee}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">Service fee <Info className="w-3 h-3" /></span>
            <span className="text-dark-900 font-medium">${stats.serviceFee.toFixed(2)}</span>
          </div>
          {protection && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Damage protection</span>
              <span className="text-dark-900 font-medium">${stats.protectionFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Refundable deposit</span>
            <span className="text-dark-900 font-medium">${listing.depositAmount}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
            <span className="font-bold text-dark-900">Total Charged</span>
            <span className="font-bold text-dark-900">${stats.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button 
        onClick={handleBook}
        disabled={!stats}
        className={cn(
          "btn-primary w-full !py-4 text-base text-center block",
          !stats && "opacity-50 cursor-not-allowed"
        )}
      >
        {listing.instantBook ? 'Instant Book' : 'Request to Book'}
      </button>
      
      <p className="text-center text-xs text-gray-400 mt-3">
        {listing.instantBook ? "You won't be charged yet" : 'The lender has 24h to accept'}
      </p>
    </div>
  );
}
