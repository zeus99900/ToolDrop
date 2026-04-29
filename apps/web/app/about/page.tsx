import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Wrench, ShieldCheck, Heart, MapPin, Truck, Zap } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding py-20 bg-dark-900 text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">Built for Halifax. <br/><span className="text-brand-500">Built for Builders.</span></h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              ToolDrop is a managed tool marketplace designed to help Halifax & Dartmouth residents get more done without the cost of ownership.
            </p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px]" />
        </section>

        {/* Story Section */}
        <section className="section-padding py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                ToolDrop started with a simple observation: our garages are full of tools that we only use once or twice a year, while our neighbours are heading to big-box stores to buy those same tools for one-off projects.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We decided to bridge that gap. By combining the community feel of a neighborhood share with the reliability of a professional rental service, we created ToolDrop. In 2026, we pivoted to a hybrid model where we provide the core "Official" inventory, ensuring every tool you rent is maintained to professional standards.
              </p>
              <div className="flex items-center gap-4 p-6 bg-brand-50 rounded-2xl border border-brand-100">
                <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-dark-900">Official ToolDrop Guarantee</p>
                  <p className="text-sm text-gray-500">Every official tool is inspected, cleaned, and tested before every rental.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative">
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white/20 text-[200px] font-bold">
                  HFX
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <span className="text-2xl font-bold text-dark-900">100%</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Reliability Rating in NS</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding py-24 bg-gray-50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-4">Why ToolDrop?</h2>
            <p className="text-gray-500">We're changing the way Halifax builds, one tool at a time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Local to the Core', desc: 'Operating out of Halifax and Dartmouth to serve our local community directly.' },
              { icon: Zap, title: 'Managed Quality', desc: 'Unlike typical P2P sites, we maintain our own fleet of professional tools.' },
              { icon: Truck, title: 'Door-to-Door', desc: 'Our local delivery team brings the tools to your jobsite or driveway.' }
            ].map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                  <v.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding py-24">
          <div className="bg-brand-600 rounded-[2rem] p-12 sm:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to get to work?</h2>
              <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of Halifax DIYers and professionals who trust ToolDrop for their equipment needs.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/tools" className="px-8 py-4 bg-white text-brand-600 rounded-xl font-bold hover:scale-105 transition-transform">Browse the Fleet</Link>
                <Link href="/signup" className="px-8 py-4 bg-brand-700 text-white rounded-xl font-bold hover:bg-brand-800 transition-colors border border-brand-500">Join the Community</Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from 'next/link';
