'use client';

import { Search, CalendarDays, Truck, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Find Your Tool',
    description: 'Search by name, category, or browse what\'s available near you. Filter by price, condition, and delivery options.',
    color: 'from-brand-500 to-brand-600',
    bgColor: 'bg-brand-50',
  },
  {
    icon: CalendarDays,
    step: '02',
    title: 'Book & Pay',
    description: 'Choose your dates, select delivery or pickup, and pay securely through the platform. Your deposit is held safely.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Truck,
    step: '03',
    title: 'Get the Tool',
    description: 'Have it delivered to your door or pick it up from the lender. Checkout photos are taken for both parties\' protection.',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Star,
    step: '04',
    title: 'Use & Return',
    description: 'Use the tool for your project, then return it when you\'re done. Leave a review and get your deposit back.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="section-padding">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-brand-600 bg-brand-50 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">
            How ToolDrop Works
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Renting tools has never been easier. Four simple steps to get what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, step, title, description, color, bgColor }, index) => (
            <div
              key={step}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-gray-200 to-gray-200" />
              )}

              <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                {/* Step number & icon */}
                <div className="relative inline-flex mb-6">
                  <div className={`w-20 h-20 rounded-2xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-9 h-9 text-gray-700" />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br ${color} text-white text-xs font-bold flex items-center justify-center shadow-lg`}>
                    {step.replace('0', '')}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-dark-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
