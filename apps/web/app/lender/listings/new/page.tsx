'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, X, Zap, Info, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/mock-data';
import { createListing } from '@/lib/main-actions';
import { toast } from 'sonner';
import { UploadDropzone } from '@/lib/uploadthing';
import LocationInput from '@/components/ui/LocationInput';

const conditions = [
  { value: 'LIKE_NEW', label: 'Like New', desc: 'Barely used, pristine condition' },
  { value: 'EXCELLENT', label: 'Excellent', desc: 'Light use, fully functional' },
  { value: 'GOOD', label: 'Good', desc: 'Normal wear, works great' },
  { value: 'FAIR', label: 'Fair', desc: 'Visible wear, fully functional' },
];

export default function CreateListingPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [pricePerWeek, setPricePerWeek] = useState('');
  const [deposit, setDeposit] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('BOTH');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [instantBook, setInstantBook] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 44.6488, lng: -63.5752 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const totalSteps = 6;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await createListing({
        title,
        category,
        brand: brand || undefined,
        model: model || undefined,
        condition: condition as any,
        description,
        pricePerDay: Number(pricePerDay),
        pricePerWeek: pricePerWeek ? Number(pricePerWeek) : undefined,
        deposit: Number(deposit),
        deliveryOption: deliveryOption as any,
        deliveryFee: deliveryFee ? Number(deliveryFee) : undefined,
        instantBook,
        images: uploadedImages,
        address,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });

      if (result.success) {
        toast.success('Listing submitted for review!');
        router.push('/lender');
      } else {
        toast.error(typeof result.error === 'string' ? result.error : 'Please fix the errors and try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <><Header /><main className="pt-20 min-h-screen bg-gray-50/50"><div className="section-padding py-8 max-w-3xl mx-auto">
      <Link href="/lender" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6"><ArrowLeft className="w-4 h-4" />Back to dashboard</Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-2">List a New Tool</h1>
      <p className="text-gray-500 mb-8">Fill in the details to get your tool listed and start earning</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div className={cn('h-2 rounded-full flex-1 transition-all', i < step ? 'bg-brand-500' : 'bg-gray-200')} />
          </div>
        ))}
        <span className="text-sm text-gray-400 ml-2">{step}/{totalSteps}</span>
      </div>

      {/* Step 1: Basics */}
      {step === 1 && (<div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-dark-900">Tool Basics</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field"><option value="">Select a category</option>{categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. DeWalt 20V MAX Impact Driver Kit" className="input-field" maxLength={60} /><p className="text-xs text-gray-400 mt-1">{title.length}/60 characters</p></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label><input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. DeWalt" className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Model</label><input value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. DCF887D2" className="input-field" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
          <div className="grid grid-cols-2 gap-3">{conditions.map(c => (<button key={c.value} onClick={() => setCondition(c.value)} className={cn('p-4 rounded-xl border-2 text-left transition-all', condition === c.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300')}><p className="font-medium text-sm text-dark-900">{c.label}</p><p className="text-xs text-gray-500 mt-0.5">{c.desc}</p></button>))}</div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your tool, what's included, and any notable features..." className="input-field min-h-[120px] resize-y" maxLength={2000} /><p className="text-xs text-gray-400 mt-1">{description.length}/2000 characters · min 50</p></div>
      </div>)}

      {/* Step 2: Photos */}
      {step === 2 && (<div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-dark-900">Photos</h2>
        <p className="text-sm text-gray-500">Add 2–10 photos. First photo will be your cover image.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <UploadDropzone
            endpoint="toolImage"
            onClientUploadComplete={(res) => {
              const urls = res.map(f => f.url);
              setUploadedImages(prev => [...prev, ...urls]);
              toast.success(`${res.length} photos uploaded!`);
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
            className="ut-label:text-brand-600 ut-button:bg-brand-600 ut-button:ut-readying:bg-brand-500 ut-button:ut-uploading:bg-brand-500 border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-brand-500 transition-colors"
          />

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {uploadedImages.map((url, i) => (
                <div key={url} className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center relative group overflow-hidden border border-gray-100">
                  <img src={url} alt={`Tool photo ${i+1}`} className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute top-2 left-2 badge bg-dark-900 text-white text-[10px]">Cover</span>}
                  <button 
                    onClick={() => setUploadedImages(prev => prev.filter(img => img !== url))}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>)}

      {/* Step 3: Location */}
      {step === 3 && (<div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-dark-900">Location</h2>
        <p className="text-sm text-gray-500">Where can this tool be picked up? We only show a general area to renters until they book.</p>
        
        <div className="space-y-4">
          <LocationInput
            onLocationSelect={(addr, lat, lng) => {
              setAddress(addr);
              setCoordinates({ lat, lng });
            }}
            defaultValue={address}
            placeholder="Search for an address..."
          />
          
          <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-900">Privacy Tip</p>
              <p className="text-xs text-brand-700 mt-0.5">We only show your approximate location (within 500m) to renters until a booking is confirmed.</p>
            </div>
          </div>
        </div>
      </div>)}

      {/* Step 4: Pricing */}
      {step === 4 && (<div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-dark-900">Pricing</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Price per day (CAD) *</label>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span><input type="number" value={pricePerDay} onChange={e => { setPricePerDay(e.target.value); if (e.target.value) { setPricePerWeek(String(Math.round(Number(e.target.value) * 6))); setDeposit(String(Math.round(Number(e.target.value) * 5))); } }} placeholder="0.00" className="input-field !pl-8" /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Weekly rate (optional)</label>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span><input type="number" value={pricePerWeek} onChange={e => setPricePerWeek(e.target.value)} placeholder="Auto: 6x daily" className="input-field !pl-8" /></div>
          <p className="text-xs text-gray-400 mt-1">Suggested: 6x daily rate</p>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Security deposit *</label>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span><input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder="Auto: 5x daily" className="input-field !pl-8" /></div>
          <p className="text-xs text-gray-400 mt-1">Held on renter's card, released after return</p>
        </div>
        {pricePerDay && (<div className="bg-brand-50 rounded-xl p-4"><p className="text-sm font-medium text-dark-900 mb-2">Earnings preview</p>
          <div className="space-y-1 text-sm"><div className="flex justify-between"><span className="text-gray-500">Daily rental</span><span className="text-dark-900">${pricePerDay}</span></div><div className="flex justify-between"><span className="text-gray-500">Platform fee (15%)</span><span className="text-red-500">-${(Number(pricePerDay) * 0.15).toFixed(2)}</span></div><div className="flex justify-between pt-1 border-t border-brand-200"><span className="font-medium text-dark-900">You earn</span><span className="font-bold text-green-600">${(Number(pricePerDay) * 0.85).toFixed(2)}/day</span></div></div>
        </div>)}
      </div>)}

      {/* Step 5: Availability & Delivery */}
      {step === 5 && (<div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-dark-900">Availability & Delivery</h2>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Delivery option *</label>
          <div className="grid grid-cols-3 gap-3">{[{v:'BOTH',l:'Both'},{v:'PICKUP_ONLY',l:'Pickup Only'},{v:'DELIVERY_ONLY',l:'Delivery Only'}].map(o => (<button key={o.v} onClick={() => setDeliveryOption(o.v)} className={cn('py-3 rounded-xl border-2 text-sm font-medium transition-all', deliveryOption === o.v ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}>{o.l}</button>))}</div>
        </div>
        {deliveryOption !== 'PICKUP_ONLY' && <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery fee</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span><input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} placeholder="e.g. 5.99" className="input-field !pl-8" /></div></div>}
        <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" checked={instantBook} onChange={e => setInstantBook(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
          <div><p className="text-sm font-medium text-dark-900 flex items-center gap-1"><Zap className="w-4 h-4 text-brand-500" />Enable Instant Book</p><p className="text-xs text-gray-500">Renters can book immediately without waiting for approval</p></div>
        </label>
      </div>)}

      {/* Step 6: Review */}
      {step === 6 && (<div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-dark-900">Review & Publish</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center overflow-hidden">
            {uploadedImages.length > 0 ? (
              <img src={uploadedImages[0]} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-300 text-6xl font-bold">{title.charAt(0) || 'T'}</span>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-dark-900">{title || 'Your Tool Title'}</h3>
            <p className="text-sm text-gray-500 mt-1">{brand || 'Brand'} {model && `· ${model}`}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{address || 'Halifax, NS'}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-3"><span className="text-2xl font-bold text-dark-900">${pricePerDay || '0'}</span><span className="text-gray-400">/day</span></div>
          </div>
        </div>
        <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl"><Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-blue-700">Your listing will be reviewed by our team before going live. This usually takes less than 24 hours.</p></div>
      </div>)}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
        {step > 1 ? <button onClick={() => setStep(step - 1)} className="btn-secondary"><ArrowLeft className="w-4 h-4" />Back</button> : <div />}
        {step < totalSteps ? <button onClick={() => setStep(step + 1)} className="btn-primary">Continue<ArrowRight className="w-4 h-4" /></button>
          : <button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary !bg-green-600 !shadow-green-600/25 hover:!bg-green-700">{isSubmitting ? 'Submitting...' : 'Submit for Review'}<ArrowRight className="w-4 h-4" /></button>}
      </div>
    </div></main><Footer /></>
  );
}
