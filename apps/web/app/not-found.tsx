import Link from 'next/link';
import { Wrench, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        {/* Animated wrench */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-brand-100 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wrench className="w-16 h-16 text-brand-500 animate-float" />
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-8xl font-black text-dark-900 mb-2 tracking-tight">
          4<span className="text-brand-500">0</span>4
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-3">
          Tool not found in the shed
        </h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this page has been checked out by someone else — or never existed.
          Let&apos;s get you back to browsing.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/tools" className="btn-secondary w-full sm:w-auto">
            <Search className="w-4 h-4" />
            Browse Tools
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 mb-4">Popular searches</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Impact Driver', 'Circular Saw', 'Pressure Washer', 'Ladder', 'Drill'].map(tool => (
              <Link
                key={tool}
                href={`/tools?q=${encodeURIComponent(tool)}`}
                className="px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {tool}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
