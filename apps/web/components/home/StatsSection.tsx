'use client';

import { useEffect, useState } from 'react';

const stats = [
  { value: 2847, suffix: '+', label: 'Tools Available', prefix: '' },
  { value: 12500, suffix: '+', label: 'Rentals Completed', prefix: '' },
  { value: 4.8, suffix: '', label: 'Average Rating', prefix: '★ ' },
  { value: 340000, suffix: '', label: 'Saved vs Buying', prefix: '$' },
];

function AnimatedCounter({ target, prefix, suffix, duration = 2000 }: { target: number; prefix: string; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  const formatted = target >= 1000
    ? Math.round(count).toLocaleString()
    : Number.isInteger(target)
      ? Math.round(count).toString()
      : count.toFixed(1);

  return (
    <span>{prefix}{formatted}{suffix}</span>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden" id="stats-section">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Join a growing community of tool sharers saving money and reducing waste.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, suffix, label, prefix }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                <AnimatedCounter target={value} prefix={prefix} suffix={suffix} />
              </div>
              <p className="text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
