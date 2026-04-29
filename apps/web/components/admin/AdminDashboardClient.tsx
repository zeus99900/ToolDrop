'use client';

import { useState } from 'react';
import { 
  Users, Package, DollarSign, AlertTriangle, ArrowUpRight, Shield, 
  Search, MoreVertical, Check, X, Calendar 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'users' | 'listings' | 'bookings' | 'finance';

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalListings: number;
    totalRevenue: number;
    openDisputes: number;
  };
  recentBookings: any[];
  allUsers: any[];
}

export default function AdminDashboardClient({ stats, recentBookings, allUsers }: AdminDashboardClientProps) {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="animate-fade-in">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 overflow-x-auto">
        {([
          ['overview', 'Overview'],
          ['users', 'Users'],
          ['listings', 'Listings'],
          ['bookings', 'Bookings'],
          ['finance', 'Finance']
        ] as [Tab, string][]).map(([id, label]) => (
          <button 
            key={id} 
            onClick={() => setTab(id)} 
            className={cn(
              'px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap', 
              tab === id ? 'bg-white text-dark-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'Active Listings', value: stats.totalListings.toLocaleString(), icon: Package, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Platform Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-brand-600 bg-brand-50' },
              { label: 'Open Disputes', value: stats.openDisputes.toString(), icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-dark-900">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-dark-900 mb-4">Recent Bookings</h3>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-900">{booking.listing.title}</p>
                        <p className="text-xs text-gray-400">by {booking.renter.firstName} {booking.renter.lastName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-dark-900">${booking.totalCharged}</p>
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full uppercase font-bold',
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-dark-900 mb-4">New Users</h3>
              <div className="space-y-3">
                {allUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark-900">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.firstName || user.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs can be implemented similarly with tables */}
      {tab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-dark-900">All Rentals</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input placeholder="Search bookings..." className="bg-transparent text-xs outline-none w-40" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tool / ID</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Renter</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark-900">{b.listing.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono">#{b.id.substring(0, 8)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-dark-900">{b.renter.firstName} {b.renter.lastName}</p>
                      <p className="text-xs text-gray-400">{b.renter.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-600">{new Date(b.startDate).toLocaleDateString()} -</p>
                      <p className="text-xs text-gray-600">{new Date(b.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'badge text-[10px]',
                        b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                        b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      )}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-dark-900">${b.totalCharged}</td>
                    <td className="px-5 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
