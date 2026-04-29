'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Search, Menu, X, Wrench, Heart, MessageSquare, Bell,
  User, ChevronDown, LogIn, MapPin, LogOut, LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q')?.toString().trim();
    if (q) {
      router.push(`/tools?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/tools');
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        )}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" id="header-logo">
              <div className="relative w-9 h-9 bg-gradient-brand rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className={cn(
                'text-xl font-bold tracking-tight transition-colors',
                scrolled ? 'text-dark-900' : 'text-white'
              )}>
                Tool<span className="text-brand-500">Drop</span>
              </span>
            </Link>

            {/* Search bar — desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className={cn(
                'flex items-center w-full gap-2 px-4 py-2.5 rounded-full transition-all duration-300 border',
                scrolled
                  ? 'bg-gray-50 border-gray-200 focus-within:bg-white focus-within:border-brand-300 focus-within:shadow-lg focus-within:shadow-brand-500/10'
                  : 'bg-white/15 border-white/20 focus-within:bg-white/25 focus-within:border-white/40'
              )}>
                <Search className={cn(
                  'w-4 h-4 flex-shrink-0',
                  scrolled ? 'text-gray-400' : 'text-white/60'
                )} />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search tools, brands, categories..."
                    suppressHydrationWarning
                    className={cn(
                      'flex-1 bg-transparent border-none outline-none text-sm placeholder:text-sm',
                      scrolled
                        ? 'text-gray-900 placeholder:text-gray-400'
                        : 'text-white placeholder:text-white/50'
                    )}
                    id="header-search-input"
                  />
                <div className={cn(
                  'hidden lg:flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-pointer transition-colors',
                  scrolled
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                )}>
                  <MapPin className="w-3 h-3" />
                  <span>Halifax</span>
                </div>
              </form>
            </div>

            {/* Nav — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/tools"
                className={cn(
                  'btn-ghost text-sm',
                  scrolled ? '' : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
                id="nav-browse"
              >
                Browse
              </Link>
              <div className="w-px h-6 bg-gray-200 mx-2" />

              {session?.user ? (
                <>
                  <Link href="/messages" className={cn('btn-ghost text-sm !px-2.5', scrolled ? '' : 'text-white/80 hover:text-white hover:bg-white/10')}>
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <Link href="/notifications" className={cn('btn-ghost text-sm !px-2.5 relative', scrolled ? '' : 'text-white/80 hover:text-white hover:bg-white/10')}>
                    <Bell className="w-4 h-4" />
                  </Link>

                  {/* User menu */}
                  <div className="relative ml-1">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={cn('flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors', scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10')}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                      </div>
                      <ChevronDown className={cn('w-3 h-3 transition-transform', scrolled ? 'text-gray-500' : 'text-white/60', userMenuOpen && 'rotate-180')} />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl z-50 py-2 animate-scale-in">
                          <div className="px-4 py-2 border-b border-gray-100 mb-1">
                            <p className="text-sm font-semibold text-dark-900">{session.user.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                          </div>
                          {(session.user as any).role === 'ADMIN' && (
                            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 bg-brand-50 hover:bg-brand-100 font-medium" onClick={() => setUserMenuOpen(false)}>
                              <Shield className="w-4 h-4" />Admin Panel
                            </Link>
                          )}
                          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />My Rentals
                          </Link>
                          <Link href="/lender" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                            <Wrench className="w-4 h-4 text-gray-400" />Lender Dashboard
                          </Link>
                          <Link href="/messages" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                            <MessageSquare className="w-4 h-4 text-gray-400" />Messages
                          </Link>
                          <Link href="/notifications" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                            <Bell className="w-4 h-4 text-gray-400" />Notifications
                          </Link>
                          <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                            <User className="w-4 h-4 text-gray-400" />Settings
                          </Link>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                              <LogOut className="w-4 h-4" />Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className={cn('btn-ghost text-sm', scrolled ? '' : 'text-white/80 hover:text-white hover:bg-white/10')} id="nav-login">
                    <LogIn className="w-4 h-4" />Log in
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm !px-5 !py-2" id="nav-signup">Sign up</Link>
                </>
              )}
            </nav>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors',
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              )}
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-white border-t border-gray-100 shadow-xl">
            {/* Mobile search */}
            <div className="px-4 pt-4">
              <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search tools..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                  id="mobile-search-input"
                />
              </form>
            </div>

            <nav className="p-4 space-y-1">
              <Link href="/tools" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                <Search className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Browse Tools</span>
              </Link>
              <Link href="/saved" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Saved</span>
              </Link>
              <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
                {session?.user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-semibold text-dark-900">{session.user.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">My Rentals</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setMobileOpen(false)}>
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); signOut(); }}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(false)}>
                      <LogIn className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Log in</span>
                    </Link>
                    <Link href="/signup" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-brand text-white font-semibold shadow-lg shadow-brand-500/25" onClick={() => setMobileOpen(false)}>
                      Sign up free
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
