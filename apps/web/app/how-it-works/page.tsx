import Link from 'next/link';
import { Wrench, Search, Calendar, Truck, Star, Shield, DollarSign, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'How It Works',
  description: 'Learn how to rent tools on ToolDrop — search, book, get delivered, and return. Simple, safe, and affordable.',
};

const steps = [
  { num: 1, title: 'Find Your Tool', desc: 'Search by name, category, or browse what\'s available near you. Filter by price, condition, brand, and delivery options.', icon: Search, color: 'from-blue-400 to-blue-600' },
  { num: 2, title: 'Book & Pay', desc: 'Choose your dates, select delivery or pickup, and pay securely through our platform. Your deposit is held safely.', icon: Calendar, color: 'from-brand-400 to-brand-600' },
  { num: 3, title: 'Get the Tool', desc: 'Have it delivered to your door or pick it up from the lender. Checkout photos are taken for both parties\' protection.', icon: Truck, color: 'from-emerald-400 to-emerald-600' },
  { num: 4, title: 'Use & Return', desc: 'Use the tool for your project, then return it when you\'re done. Leave a review and get your deposit back.', icon: Star, color: 'from-amber-400 to-amber-600' },
];

const features = [
  { icon: Shield, title: 'Deposit Protection', desc: 'Deposits are held securely and returned automatically after a successful return. Dispute resolution is built in.' },
  { icon: DollarSign, title: 'Fair Pricing', desc: 'Lenders set their own rates. Renters only pay for the days they need. No hidden fees.' },
  { icon: Users, title: 'Verified Community', desc: 'All users are verified. Ratings and reviews build trust. Every rental is tracked.' },
  { icon: Truck, title: 'Same-Day Delivery', desc: 'Many lenders offer same-day delivery for a small fee. Or pick up for free.' },
];

export default function HowItWorksPage() {
  return (
    <><Header /><main className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-hero text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="section-padding relative text-center">
          <div className="badge bg-white/10 text-white/80 border border-white/10 mb-6 mx-auto">Simple Process</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            How Tool<span className="text-brand-400">Drop</span> Works
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Renting tools has never been easier. Four simple steps to get what you need, when you need it.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mb-16 last:mb-0 group">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full">Step {step.num}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-dark-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed max-w-lg">{step.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="hidden sm:block absolute left-8 mt-20 w-px h-12 bg-gray-200 ml-[1.75rem]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900 mb-3">Built for Trust & Safety</h2>
            <p className="text-gray-500">Every rental is protected by our platform guarantees</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-dark-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Lenders */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-3xl font-bold mb-4 relative">Want to Lend Instead?</h2>
            <p className="text-white/70 text-lg mb-6 max-w-xl relative">
              Turn your idle tools into income. List for free, set your own prices, and earn money from tools sitting in your garage.
            </p>
            <ul className="space-y-2 mb-8 relative">
              {['Free to list — no monthly fees', 'Set your own daily & weekly rates', 'Choose delivery, pickup, or both', 'Deposit protection for your tools', 'Get paid within 24 hours of return'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/lender/listings/new" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg relative">
              Start Listing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="section-padding text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-6">Browse thousands of tools near you</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/tools" className="btn-primary"><Search className="w-4 h-4" />Browse Tools</Link>
            <Link href="/signup" className="btn-secondary">Sign Up Free</Link>
          </div>
        </div>
      </section>
    </main><Footer /></>
  );
}
