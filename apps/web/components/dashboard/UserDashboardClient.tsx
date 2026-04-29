'use client';

import { useState } from 'react';
import { Package, Clock, History, Heart, Star, Calendar, MapPin, Truck, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { submitReview } from '@/lib/main-actions';
import RentalTimer from '@/components/listings/RentalTimer';

type Tab = 'active' | 'past' | 'saved';

interface UserDashboardClientProps {
  rentals: any[];
}

const statusCfg: Record<string, { label: string; color: string }> = {
  ACTIVATED: { label: 'In Progress', color: 'bg-emerald-100 text-emerald-700' },
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700' },
  CONFIRMED: { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function UserDashboardClient({ rentals }: UserDashboardClientProps) {
  const [tab, setTab] = useState<Tab>('active');
  
  const active = rentals.filter(r => ['ACTIVATED', 'ACTIVE', 'CONFIRMED', 'PENDING'].includes(r.status));
  const past = rentals.filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status));
  
  // Review modal state
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReview = async () => {
    if (!reviewBookingId) return;
    setIsSubmittingReview(true);
    try {
      const result = await submitReview(reviewBookingId, reviewRating, reviewComment);
      if (result.success) {
        toast.success('Review submitted! Thank you.');
        setReviewBookingId(null);
        setReviewComment('');
        setReviewRating(5);
      } else {
        toast.error(result.error || 'Failed to submit review');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
        {([
          ['active', 'Active & Upcoming'],
          ['past', 'Past Rentals'],
          ['saved', 'Saved']
        ] as [Tab, string][]).map(([id, label]) => (
          <button 
            key={id} 
            onClick={() => setTab(id)} 
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-medium transition-all', 
              tab === id ? 'bg-white text-dark-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'active' && (
        <div className="space-y-4 animate-fade-in">
          {active.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-900">No active rentals</h3>
              <p className="text-gray-500 mt-1">Browse tools to find your next rental</p>
              <Link href="/tools" className="btn-primary mt-4 inline-block">Browse Tools</Link>
            </div>
          )}
          {active.map(r => { 
            const cfg = statusCfg[r.status] || statusCfg.PENDING; 
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 h-20 sm:h-24 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white/30 text-3xl font-bold flex-shrink-0">
                    {r.listing.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('badge', cfg.color)}>{cfg.label}</span>
                    </div>
                    <h3 className="font-semibold text-dark-900 mb-1">{r.listing.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">{r.isDelivery ? <Truck className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}{r.isDelivery ? 'Delivery' : 'Pickup'}</span>
                      <span className="font-medium text-dark-900">${r.totalCharged} CAD</span>
                    </div>

                    {r.totalHours && r.pickedUpAt && r.status === 'ACTIVATED' && (
                      <RentalTimer pickedUpAt={r.pickedUpAt} totalHours={r.totalHours} className="mb-3" />
                    )}

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[8px] font-bold">
                        {r.lender.firstName?.charAt(0) || r.lender.email?.charAt(0) || 'U'}
                      </div>
                      <span>
                        {r.lender.firstName && r.lender.lastName 
                          ? `${r.lender.firstName} ${r.lender.lastName}` 
                          : r.lender.firstName || r.lender.email.split('@')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <Link href="/contact" className="btn-secondary !py-2 !px-3 text-sm flex-1 flex items-center justify-center gap-2"><MessageSquare className="w-3.5 h-3.5" />Support</Link>
                    {(r.status === 'ACTIVE' || r.status === 'ACTIVATED') && (
                      <button 
                        onClick={() => toast.success('Return requested! An admin will contact you for pickup shortly.')} 
                        className="btn-primary !py-2 !px-3 text-sm flex-1"
                      >
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ); 
          })}
        </div>
      )}

      {tab === 'past' && (
        <div className="space-y-4 animate-fade-in">
          {past.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No past rentals found</p>
            </div>
          )}
          {past.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-20 h-16 sm:h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 text-2xl font-bold flex-shrink-0">
                  {r.listing.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn('badge mb-1', statusCfg[r.status]?.color || 'bg-gray-100')}>
                    {statusCfg[r.status]?.label || r.status}
                  </span>
                  <h3 className="font-semibold text-dark-900 truncate">{r.listing.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>{new Date(r.startDate).toLocaleDateString()}</span>
                    <span>{r.lender.firstName}</span>
                    <span className="font-medium text-dark-900">${r.totalCharged}</span>
                  </div>
                </div>
                {r.status === 'COMPLETED' && (
                  <button onClick={() => setReviewBookingId(r.id)} className="btn-primary !py-2 !px-4 text-sm"><Star className="w-3.5 h-3.5" />Leave Review</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'saved' && (
        <div className="animate-fade-in text-center py-16">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-900">No saved tools yet</h3>
          <p className="text-gray-500 mt-1 mb-4">Save tools you're interested in to find them later</p>
          <Link href="/tools" className="btn-primary inline-block">Browse Tools</Link>
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-900">Leave a Review</h3>
              <button onClick={() => setReviewBookingId(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setReviewRating(star)}>
                  <Star className={cn('w-8 h-8 transition-colors', star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Tell others about your experience..."
              className="input-field min-h-[100px] resize-y mb-4"
            />
            <button
              onClick={handleReview}
              disabled={isSubmittingReview || !reviewComment.trim()}
              className="btn-primary w-full"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
