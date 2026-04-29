import Link from 'next/link';
import { Wrench, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  'Marketplace': [
    { label: 'Browse Tools', href: '/tools' },
    { label: 'Browse Kits', href: '/kits' },
    { label: 'Categories', href: '/categories' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  'For Lenders': [
    { label: 'List Your Tools', href: '/lender' },
    { label: 'Earnings Calculator', href: '/earnings' },
    { label: 'Lender Guide', href: '/lender-guide' },
    { label: 'Safety Tips', href: '/safety' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  'Legal': [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cancellation Policy', href: '/cancellation' },
    { label: 'Fees', href: '/fees' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white mt-auto">
      {/* Main footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-brand rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Tool<span className="text-brand-500">Drop</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Halifax & Dartmouth’s premier hybrid tool marketplace. Professional-grade rentals with the reliability of a managed service.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@tooldrop.ca" className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 transition-colors">
                <Mail className="w-4 h-4" />
                hello@tooldrop.ca
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                Halifax, NS, Canada
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ToolDrop. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600 bg-white/5 px-3 py-1 rounded-full">
              🇨🇦 Made in Canada
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
