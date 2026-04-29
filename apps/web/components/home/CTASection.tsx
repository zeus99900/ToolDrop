import Link from 'next/link';
import { ArrowRight, Wrench } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-white" id="cta-section">
      <div className="section-padding">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-10 sm:p-16 text-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='m0 40 40-40H20L0 20M40 0v20L20 40h20'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Floating decorations */}
          <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-white/10 animate-float" />
          <div className="absolute bottom-12 left-8 w-14 h-14 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              For tool owners
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Got tools sitting in
              <br />
              your garage?
            </h2>

            <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
              Turn idle tools into income. List for free, set your own prices, 
              and start earning from tools you already own.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/lender" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold text-base rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                Start Earning
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center gap-2 px-6 py-4 text-white font-semibold text-base rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">
                Learn More
              </Link>
            </div>

            <p className="text-sm text-white/50 mt-6">
              Free to list · No monthly fees · Get paid within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
