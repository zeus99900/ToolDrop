'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DollarSign, Package, Clock, Star, Plus, BarChart3, Calendar, Eye, MoreVertical, ArrowUpRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { respondToBooking } from '@/lib/main-actions';
import { confirmPickup, confirmReturn } from '@/lib/actions/bookings';
import { toast } from 'sonner';

interface LenderDashboardClientProps {
  listings: any[];
  bookings: any[];
  stats: {
    monthlyEarnings: number;
    activeRentals: number;
    pendingPayout: number;
    avgRating: number;
  };
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  ACTIVATED: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700' },
  RETURN_PENDING: { label: 'Return Pending', color: 'bg-purple-100 text-purple-700' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
};

type Tab = 'overview' | 'listings' | 'bookings' | 'earnings';

export default function LenderDashboardClient({ listings, bookings, stats }: LenderDashboardClientProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [localBookings, setLocalBookings] = useState(bookings);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleBookingResponse = async (bookingId: string, action: 'ACCEPT' | 'DECLINE') => {
    setProcessingId(bookingId);
    try {
      const result = await respondToBooking(bookingId, action);
      if (result.success) {
        toast.success(action === 'ACCEPT' ? 'Booking accepted!' : 'Booking declined.');
        setLocalBookings(prev => prev.map(b => 
          b.id === bookingId 
            ? { ...b, status: action === 'ACCEPT' ? 'CONFIRMED' : 'CANCELLED' }
            : b
        ));
      } else {
        toast.error(result.error || 'Failed to update booking');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmPickup = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const result = await confirmPickup(bookingId);
      if (result.success) {
        toast.success('Pickup confirmed! Timer started.');
        setLocalBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'ACTIVATED', pickedUpAt: result.pickedUpAt } : b
        ));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm pickup');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReturn = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      const result = await confirmReturn(bookingId);
      if (result.success) {
        toast.success('Return confirmed! Timer stopped.');
        setLocalBookings(prev => prev.map(b => 
          b.id === bookingId ? { ...b, status: 'COMPLETED', actualReturnAt: result.returnedAt } : b
        ));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm return');
    } finally {
      setProcessingId(null);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'listings', label: 'My Listings' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'earnings', label: 'Earnings' },
  ];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">Lender Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your tools, bookings, and earnings</p>
            </div>
            <Link href="/lender/listings/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              List a Tool
            </Link>
          </div>

          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 overflow-x-auto">
            {tabs.map(({ id, label }) => (
              <button 
                key={id} 
                onClick={() => setTab(id)} 
                className={cn(
                  'px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap', 
                  tab === id ? 'bg-white text-dark-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'This Month', value: `$${stats.monthlyEarnings}`, icon: DollarSign, change: '+12%', color: 'text-brand-600 bg-brand-50' },
                  { label: 'Active Rentals', value: stats.activeRentals.toString(), icon: Package, change: '+1', color: 'text-blue-600 bg-blue-50' },
                  { label: 'Pending Payout', value: `$${stats.pendingPayout}`, icon: Clock, change: '24h', color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Avg Rating', value: stats.avgRating.toString(), icon: Star, change: '+0.1', color: 'text-amber-600 bg-amber-50' },
                ].map(({ label, value, icon: Icon, change, color }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                        <ArrowUpRight className="w-3 h-3" />
                        {change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-dark-900">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Action Required</h2>
                <div className="space-y-3">
                  {localBookings.filter(b => ['PENDING', 'CONFIRMED', 'ACTIVATED', 'RETURN_PENDING'].includes(b.status)).length > 0 ? (
                    localBookings.filter(b => ['PENDING', 'CONFIRMED', 'ACTIVATED', 'RETURN_PENDING'].includes(b.status)).map(booking => {
                      const cfg = statusMap[booking.status] || statusMap.PENDING;
                      return (
                        <div key={booking.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                          <div className="flex-1 min-w-0">
                            <span className={cn('badge mb-1', cfg.color)}>{cfg.label}</span>
                            <p className="font-medium text-dark-900 truncate">{booking.listing.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span>{booking.renter.firstName} {booking.renter.lastName} · ★{booking.renter.avgRatingAsRenter || 'N/A'}</span>
                              <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                              <span className="font-medium text-dark-900">${booking.totalCharged}</span>
                              {booking.totalHours && <span className="badge bg-brand-50 text-brand-700 ml-2">{booking.totalHours}h Rental</span>}
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            {booking.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleBookingResponse(booking.id, 'ACCEPT')} 
                                  disabled={processingId === booking.id}
                                  className="btn-primary flex-1 sm:flex-initial !py-2 !px-4 text-sm"
                                >
                                  {processingId === booking.id ? 'Processing...' : 'Accept'}
                                </button>
                                <button 
                                  onClick={() => handleBookingResponse(booking.id, 'DECLINE')}
                                  disabled={processingId === booking.id}
                                  className="btn-secondary flex-1 sm:flex-initial !py-2 !px-4 text-sm"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <button 
                                onClick={() => handleConfirmPickup(booking.id)}
                                disabled={processingId === booking.id}
                                className="btn-primary flex-1 sm:flex-initial !py-2 !px-4 text-sm"
                              >
                                {processingId === booking.id ? 'Starting...' : 'Confirm Pickup'}
                              </button>
                            )}
                            {(booking.status === 'ACTIVATED' || booking.status === 'RETURN_PENDING') && (
                              <button 
                                onClick={() => handleConfirmReturn(booking.id)}
                                disabled={processingId === booking.id}
                                className="btn-primary flex-1 sm:flex-initial !py-2 !px-4 text-sm"
                              >
                                {processingId === booking.id ? 'Finishing...' : 'Confirm Return'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-400 text-sm">No pending actions</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Weekly Earnings</h2>
                <div className="grid grid-cols-7 gap-2 items-end h-40">
                  {[65, 40, 85, 55, 95, 70, 45].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg hover:from-brand-600 hover:to-brand-500 transition-all" 
                        style={{ height: `${h}%` }} 
                      />
                      <span className="text-[10px] text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'listings' && (
            <div className="animate-fade-in grid gap-4">
              {listings.length > 0 ? (
                listings.map((l: any, i: number) => (
                  <div key={l.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={cn(
                      'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold flex-shrink-0',
                      ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-emerald-400 to-emerald-600', 'from-amber-400 to-amber-600'][i % 4]
                    )}>
                      {l.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-dark-900 truncate">{l.title}</p>
                        <span className={cn('badge', l.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                          {l.isAvailable ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="font-semibold text-dark-900">${l.pricePerDay}/day</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {l.avgRating || 'New'}
                        </span>
                        <span>{l._count?.bookings || 0} rentals</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {Math.floor(Math.random() * 500)}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark-900">No listings yet</h3>
                  <p className="text-gray-500 mb-6">List your first tool and start earning!</p>
                  <Link href="/lender/listings/new" className="btn-primary">List a Tool</Link>
                </div>
              )}
            </div>
          )}

          {tab === 'bookings' && (
            <div className="space-y-3 animate-fade-in">
              {localBookings.length > 0 ? (
                localBookings.map(b => {
                  const cfg = statusMap[b.status] || statusMap.PENDING;
                  return (
                    <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn('badge', cfg.color)}>{cfg.label}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-semibold text-dark-900 mb-1">{b.listing.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold">
                            {b.renter.firstName?.charAt(0) || b.renter.email?.charAt(0) || 'U'}
                          </div>
                          {b.renter.firstName && b.renter.lastName 
                            ? `${b.renter.firstName} ${b.renter.lastName}` 
                            : b.renter.firstName || b.renter.email.split('@')[0]} · ★{b.renter.avgRatingAsRenter || 'N/A'}
                        </div>
                        <span className="font-semibold text-dark-900">${b.totalCharged}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark-900">No bookings yet</h3>
                  <p className="text-gray-500">Your tool bookings will appear here.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'earnings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { l: 'Today', v: 0 },
                  { l: 'This Week', v: 0 },
                  { l: 'This Month', v: stats.monthlyEarnings },
                  { l: 'All Time', v: stats.monthlyEarnings },
                ].map(({ l, v }) => (
                  <div key={l} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                    <p className="text-2xl font-bold text-dark-900">${v.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-dark-900 mb-4">Recent Payouts</h3>
                <div className="text-center py-10">
                  <DollarSign className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No recent payouts</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
