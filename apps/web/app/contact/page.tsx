'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, MessageSquare, Clock, Shield } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-gray-50/50 min-h-screen">
        <div className="section-padding py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Info Column */}
              <div>
                <h1 className="text-4xl font-bold text-dark-900 mb-6">Contact Us</h1>
                <p className="text-xl text-gray-500 mb-12">
                  Have a question about a rental? Need help finding the right tool? Our Halifax-based support team is here to help.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-600 flex-shrink-0 border border-gray-100">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark-900">Email Support</h3>
                      <p className="text-gray-500 mb-1">General inquiries & support</p>
                      <a href="mailto:hello@tooldrop.ca" className="text-brand-600 font-semibold hover:underline">hello@tooldrop.ca</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-600 flex-shrink-0 border border-gray-100">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark-900">Halifax Hub</h3>
                      <p className="text-gray-500">Local pickup & delivery hub</p>
                      <p className="text-dark-900 font-semibold">Halifax, Nova Scotia, Canada</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-600 flex-shrink-0 border border-gray-100">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark-900">Operating Hours</h3>
                      <p className="text-gray-500">Mon - Fri: 8am - 6pm AST</p>
                      <p className="text-gray-500">Sat - Sun: 9am - 4pm AST</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-900">24/7 Damage Reporting</span>
                  </div>
                  <p className="text-sm text-emerald-700">Active renters can report damage or issues via their dashboard or by emailing emergency@tooldrop.ca at any time.</p>
                </div>
              </div>

              {/* Form Column */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-brand-500/5 border border-gray-100">
                <h2 className="text-2xl font-bold text-dark-900 mb-8">Send us a message</h2>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">First Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                    <select className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all appearance-none">
                      <option>General Inquiry</option>
                      <option>Booking Question</option>
                      <option>Issue with a Tool</option>
                      <option>Partnership Proposal</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Message</label>
                    <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none" placeholder="How can we help?"></textarea>
                  </div>

                  <button className="btn-primary w-full !py-4 text-base">Send Message</button>
                  <p className="text-xs text-center text-gray-400">Typical response time: &lt; 2 hours during operating hours.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
