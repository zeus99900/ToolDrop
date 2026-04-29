'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, Shield, Calendar, ArrowRight, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createBooking } from '@/lib/actions/bookings';
import { toast } from 'sonner';

// Initialize Stripe (will only happen once)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFlowProps {
  listing: {
    id: string;
    slug: string;
    title: string;
    brand: string | null;
    model: string | null;
    pricePerDay: number;
    depositAmount: number;
    deliveryFee: number | null;
    deliveryOption: string;
  };
}

export default function CheckoutFlow({ listing }: CheckoutFlowProps) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'daily' | 'hourly'>((searchParams?.get('mode') as any) || 'daily');
  const [startDate, setStartDate] = useState<string>(searchParams?.get('startDate') || '');
  const [endDate, setEndDate] = useState<string>(searchParams?.get('endDate') || '');
  const [hours, setHours] = useState<number>(parseInt(searchParams?.get('hours') || '3'));
  const [delivery, setDelivery] = useState(searchParams?.get('delivery') === 'true' || listing.deliveryOption !== 'PICKUP_ONLY');
  const [protection, setProtection] = useState(searchParams?.get('protection') === 'true');
  const [agreed, setAgreed] = useState(false);
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>('');
  
  useEffect(() => {
    if (!startDate) {
      const start = new Date();
      start.setDate(start.getDate() + 1);
      setStartDate(start.toISOString().split('T')[0]);
    }
    if (!endDate && mode === 'daily') {
      const end = new Date();
      end.setDate(new Date(startDate || new Date()).getDate() + 3);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, endDate, mode]);

  const preparePayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          startDate,
          endDate,
          delivery,
          protection
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to prepare payment');
      
      setClientSecret(data.clientSecret);
      setIsMockMode(data.isMockMode);
      setPricing(data.pricing);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (!agreed) return;
      preparePayment();
    }
  };

  // Pricing calculations for the UI before step 3
  const subtotal = mode === 'daily' 
    ? listing.pricePerDay * (startDate && endDate ? Math.max(1, Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) : 1)
    : ((listing as any).pricePerHour || listing.pricePerDay / 8) * hours;
    
  const protectionFee = protection ? subtotal * 0.15 : 0;
  const serviceFee = subtotal * 0.10;
  const deliveryFee = delivery ? (listing.deliveryFee || 0) : 0;
  const total = subtotal + protectionFee + serviceFee + deliveryFee + listing.depositAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Step 1: Dates & Delivery */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-dark-900">Choose Dates & Delivery</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start date</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm text-dark-900 outline-none w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End date</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm text-dark-900 outline-none w-full" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How do you want to get it?</label>
              <div className="grid grid-cols-2 gap-3">
                {listing.deliveryOption !== 'PICKUP_ONLY' && (
                  <button onClick={() => setDelivery(true)} className={cn('p-4 rounded-xl border-2 text-left transition-all', delivery ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300')}>
                    <Truck className={cn('w-5 h-5 mb-2', delivery ? 'text-brand-600' : 'text-gray-400')} />
                    <p className="font-medium text-sm text-dark-900">Delivery</p>
                    <p className="text-xs text-gray-500">${listing.deliveryFee} · Same day</p>
                  </button>
                )}
                {listing.deliveryOption !== 'DELIVERY_ONLY' && (
                  <button onClick={() => setDelivery(false)} className={cn('p-4 rounded-xl border-2 text-left transition-all', !delivery ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300')}>
                    <MapPin className={cn('w-5 h-5 mb-2', !delivery ? 'text-brand-600' : 'text-gray-400')} />
                    <p className="font-medium text-sm text-dark-900">Pickup</p>
                    <p className="text-xs text-gray-500">Free · Coordinate with lender</p>
                  </button>
                )}
              </div>
            </div>
            
            <label className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 cursor-pointer">
              <input type="checkbox" checked={protection} onChange={e => setProtection(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-brand-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-dark-900 flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-600" />Add Damage Protection</p>
                <p className="text-xs text-gray-500">Covers up to $500 in accidental damage · ${(subtotal * 0.15).toFixed(2)}</p>
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-dark-900">Review & Confirm</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white/30 text-2xl font-bold flex-shrink-0">
                  {listing.brand?.charAt(0) || listing.title.charAt(0)}
                </div>
                  <h3 className="font-semibold text-dark-900">{listing.title}</h3>
                  <p className="text-sm text-gray-500">
                    {listing.brand} · {startDate} 
                    {mode === 'daily' ? ` to ${endDate} · ${Math.max(1, Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)} days` : ` · ${hours} hours`}
                  </p>
                  <p className="text-sm text-gray-500">{delivery ? '🚚 Delivery' : '📍 Pickup'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message to lender (optional)</label>
              <textarea placeholder="Hi! I'll need this for a deck project..." className="input-field min-h-[80px] resize-y" />
            </div>
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-500" />
              <span className="text-sm text-gray-500">I agree to the rental terms and cancellation policy</span>
            </label>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && clientSecret && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-dark-900">Payment</h2>
            
            {isMockMode ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm mb-6 flex gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p><strong>Demo Mode:</strong> Stripe is not configured. Click the button below to simulate a successful payment.</p>
                </div>
                <button 
                  className="btn-primary w-full"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const result = await createBooking({
                        listingId: listing.id,
                        startDate,
                        endDate,
                        mode,
                        hours,
                        delivery,
                        protection,
                        paymentIntentId: 'mock_payment_intent_123'
                      });
                      toast.success("Mock payment successful!");
                      setBookingRef(result.bookingId);
                      setStep(4);
                    } catch (err: any) {
                      toast.error(err.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {isLoading ? 'Processing...' : 'Simulate Payment & Confirm'}
                </button>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <StripePaymentForm 
                  clientSecret={clientSecret}
                  listingId={listing.id}
                  startDate={startDate}
                  endDate={endDate}
                  mode={mode}
                  hours={hours}
                  delivery={delivery}
                  protection={protection}
                  onSuccess={(ref: string) => {
                    setBookingRef(ref);
                    setStep(4);
                  }}
                />
              </Elements>
            )}
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-dark-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-2">Reference: <span className="font-mono font-semibold text-dark-900">{bookingRef}</span></p>
            <p className="text-sm text-gray-400 mb-8">The lender has been notified. You'll receive a confirmation email shortly.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/dashboard" className="btn-primary">View My Rentals</Link>
              <Link href="/tools" className="btn-secondary">Browse More</Link>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="btn-secondary"><ArrowLeft className="w-4 h-4" />Back</button>
            ) : <div />}
            <button onClick={handleNextStep} disabled={isLoading || (step === 2 && !agreed)} className="btn-primary">
              {isLoading ? 'Loading...' : 'Continue'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Price Summary Sidebar */}
      {step < 4 && (
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-dark-900 mb-4">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {mode === 'daily' 
                    ? `$${listing.pricePerDay} × ${Math.max(1, Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)} days` 
                    : `$${((listing as any).pricePerHour || listing.pricePerDay / 8).toFixed(2)} × ${hours} hours`}
                </span>
                <span className="text-dark-900">${(pricing?.subtotal || subtotal).toFixed(2)}</span>
              </div>
              {delivery && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery fee</span>
                  <span className="text-dark-900">${(pricing?.deliveryFee || deliveryFee).toFixed(2)}</span>
                </div>
              )}
              {protection && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Damage protection</span>
                  <span className="text-dark-900">${(pricing?.protectionFee || protectionFee).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Service fee</span>
                <span className="text-dark-900">${(pricing?.serviceFee || serviceFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium bg-emerald-50/50 p-2 rounded-lg mt-2">
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />Refundable Deposit</span>
                <span>${listing.depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100 font-bold text-lg">
                <span className="text-dark-900">Total</span>
                <span className="text-dark-900">${(pricing?.total || total).toFixed(2)} CAD</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
                By confirming, you agree to our terms. Your deposit is held securely and released after the tool is returned in good condition.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inner Stripe form component
function StripePaymentForm({ clientSecret, listingId, startDate, endDate, mode, hours, delivery, protection, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    // For Stripe Elements, we confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Prevent immediate redirect so we can save to DB
    });

    if (error) {
      setErrorMessage(error.message || 'An unknown error occurred');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded! Save booking to DB via server action.
      try {
        const result = await createBooking({
          listingId,
          startDate,
          endDate,
          mode,
          hours,
          delivery,
          protection,
          paymentIntentId: paymentIntent.id
        });
        
        toast.success("Payment successful!");
        onSuccess(result.bookingId);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to save booking. Please contact support.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <PaymentElement />
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}
      <button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="btn-primary w-full mt-6"
      >
        {isProcessing ? 'Processing...' : 'Pay & Confirm Booking'}
      </button>
    </form>
  );
}
