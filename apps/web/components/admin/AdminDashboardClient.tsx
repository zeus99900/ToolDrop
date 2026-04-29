'use client';

import { useState } from 'react';
import { 
  Users, Package, DollarSign, AlertTriangle, ArrowUpRight, Shield, 
  Search, MoreVertical, Check, X, Calendar, Loader2, Trash2, Ban 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  updateListingStatus, 
  deleteListing, 
  updateUserStatus, 
  deleteUser,
  updateBookingStatus,
  updateListingDetails 
} from '@/lib/actions/admin';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'users' | 'listings' | 'bookings' | 'finance' | 'disputes';

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalListings: number;
    totalRevenue: number;
    openDisputes: number;
  };
  recentBookings: any[];
  allUsers: any[];
  allListings: any[];
}

export default function AdminDashboardClient({ stats, recentBookings, allUsers, allListings }: AdminDashboardClientProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const router = useRouter();

  const handleUpdateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    setIsProcessing(editingListing.id);
    try {
      await updateListingDetails(editingListing.id, editingListing);
      toast.success('Listing updated successfully');
      setEditingListing(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleListingAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    setIsProcessing(id);
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to permanently delete this tool?')) return;
        await deleteListing(id);
        toast.success('Listing deleted');
      } else {
        await updateListingStatus(id, action === 'approve');
        toast.success(action === 'approve' ? 'Listing approved' : 'Listing rejected');
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUserAction = async (id: string, action: 'suspend' | 'activate' | 'delete') => {
    setIsProcessing(id);
    try {
      if (action === 'delete') {
        if (!confirm('Permanently delete this user and all their data?')) return;
        await deleteUser(id);
        toast.success('User deleted');
      } else {
        await updateUserStatus(id, action === 'suspend' ? 'SUSPENDED' : 'ACTIVE');
        toast.success(`User ${action === 'suspend' ? 'suspended' : 'activated'}`);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.firstName?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredListings = allListings.filter(l => 
    l.title?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.lender?.email?.toLowerCase().includes(listingSearch.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 overflow-x-auto">
        {([
          ['overview', 'Overview'],
          ['users', 'Users'],
          ['listings', 'Listings'],
          ['bookings', 'Bookings'],
          ['disputes', 'Disputes'],
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
                        (booking.status === 'CONFIRMED' || booking.status === 'ACTIVATED') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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

      {tab === 'listings' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-dark-900">Platform Inventory</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  placeholder="Search listings..." 
                  className="bg-transparent text-xs outline-none w-40" 
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tool</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lender</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pricing</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map(l => (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark-900">{l.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono">#{l.id.substring(0, 8)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-dark-900">{l.lender?.firstName || 'Unknown'} {l.lender?.lastName || ''}</p>
                      <p className="text-xs text-gray-400">{l.lender?.email || 'No email'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600 font-medium">{l.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-dark-900">${l.pricePerDay}/day</p>
                      {l.allowHourly && <p className="text-[10px] text-brand-600 font-medium">${l.pricePerHour}/hr enabled</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'badge text-[10px]',
                        l.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {l.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {l.isOfficial && <span className="ml-1 badge bg-blue-100 text-blue-700 text-[10px]">Official</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {isProcessing === l.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <>
                            <button 
                              onClick={() => setEditingListing(l)}
                              className="text-brand-600 hover:text-brand-700 text-xs font-bold mr-3"
                            >
                              Edit
                            </button>
                            {!l.isApproved && (
                              <button 
                                onClick={() => handleListingAction(l.id, 'approve')}
                                className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                            )}
                            <button 
                              onClick={() => handleListingAction(l.id, l.isApproved ? 'delete' : 'reject')}
                              className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                            >
                              {l.isApproved ? <Trash2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              {l.isApproved ? 'Delete' : 'Reject'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mode / Info</th>
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
                      <p className="text-sm text-dark-900">{b.renter?.firstName || 'User'} {b.renter?.lastName || ''}</p>
                      <p className="text-xs text-gray-400">{b.renter?.email || 'No email'}</p>
                    </td>
                    <td className="px-5 py-4">
                      {b.totalHours ? (
                        <p className="text-xs text-brand-600 font-bold">{b.totalHours} Hour Rental</p>
                      ) : (
                        <p className="text-xs text-gray-600">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'badge text-[10px]',
                        b.status === 'ACTIVATED' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
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

      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-dark-900">Registered Users</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  placeholder="Search users..." 
                  className="bg-transparent text-xs outline-none w-40" 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Activity</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                          {u.firstName?.charAt(0) || u.email?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-dark-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        'w-2 h-2 rounded-full inline-block mr-2',
                        u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500'
                      )} />
                      <span className="text-xs text-gray-600">{u.status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-600">{u.totalListings || 0} Tools · {u.totalRentals || 0} Rentals</p>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {isProcessing === u.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-auto" />
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleUserAction(u.id, u.status === 'SUSPENDED' ? 'activate' : 'suspend')}
                            className={cn(
                              'text-xs font-bold flex items-center gap-1',
                              u.status === 'SUSPENDED' ? 'text-emerald-600' : 'text-amber-600'
                            )}
                          >
                            {u.status === 'SUSPENDED' ? <Check className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                            {u.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                          </button>
                          <button 
                            onClick={() => handleUserAction(u.id, 'delete')}
                            className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center py-20 animate-fade-in">
          <AlertTriangle className="w-12 h-12 text-amber-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-900">Dispute Center</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">There are currently {stats.openDisputes} open disputes requiring investigation. Our support team is notified of each incident.</p>
          <button className="btn-secondary mt-6 border-amber-200 text-amber-700 hover:bg-amber-50">View Queue</button>
        </div>
      )}

      {tab === 'finance' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center py-20">
            <DollarSign className="w-12 h-12 text-brand-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-dark-900">Financial Reports</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">Comprehensive financial auditing and payout management will appear here once the platform processes more volume.</p>
            <button className="btn-primary mt-6">Export Q2 Report</button>
          </div>
        </div>
      )}
      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-dark-900">Edit Tool Listing</h3>
              <button onClick={() => setEditingListing(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateListing} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tool Title</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors"
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({...editingListing, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors min-h-[100px]"
                  value={editingListing.description}
                  onChange={(e) => setEditingListing({...editingListing, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Price ($)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors"
                    value={editingListing.pricePerDay}
                    onChange={(e) => setEditingListing({...editingListing, pricePerDay: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hourly Price ($)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-500 transition-colors"
                    value={editingListing.pricePerHour || ''}
                    onChange={(e) => setEditingListing({...editingListing, pricePerHour: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing === editingListing.id}
                  className="btn-primary flex-1"
                >
                  {isProcessing === editingListing.id ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}