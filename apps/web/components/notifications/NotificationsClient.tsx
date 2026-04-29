'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Package, MessageSquare, DollarSign, Star, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

type NType = 'BOOKING_REQUEST' | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'TOOL_DISPATCHED' | 'TOOL_RETURNED' | 'REVIEW_RECEIVED' | 'MESSAGE_RECEIVED' | 'PAYOUT_PROCESSED' | 'DISPUTE_OPENED' | 'DISPUTE_RESOLVED' | 'ACCOUNT_VERIFIED' | 'PROMOTIONAL';

interface Notification {
  id: string;
  type: NType;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  data?: any;
}

const iconMap: Partial<Record<NType, { icon: React.ElementType; color: string }>> = {
  BOOKING_REQUEST: { icon: Package, color: 'bg-blue-100 text-blue-600' },
  BOOKING_CONFIRMED: { icon: Package, color: 'bg-blue-100 text-blue-600' },
  MESSAGE_RECEIVED: { icon: MessageSquare, color: 'bg-brand-100 text-brand-600' },
  PAYOUT_PROCESSED: { icon: DollarSign, color: 'bg-green-100 text-green-600' },
  REVIEW_RECEIVED: { icon: Star, color: 'bg-amber-100 text-amber-600' },
  ACCOUNT_VERIFIED: { icon: Shield, color: 'bg-purple-100 text-purple-600' },
  BOOKING_CANCELLED: { icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
};

const defaultIcon = { icon: Bell, color: 'bg-gray-100 text-gray-600' };

export default function NotificationsClient({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifs, setNotifs] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const unreadCount = notifs.filter(n => !n.readAt).length;
  const filtered = filter === 'unread' ? notifs.filter(n => !n.readAt) : notifs;

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, readAt: new Date().toISOString() })));
  const markRead = (id: string) => setNotifs(notifs.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
  const remove = (id: string) => setNotifs(notifs.filter(n => n.id !== id));

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 flex items-center gap-3">
                Notifications
                {unreadCount > 0 && <span className="px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-sm font-bold">{unreadCount}</span>}
              </h1>
              <p className="text-gray-500 mt-1">Stay updated on bookings, messages, and payments</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="btn-secondary !py-2 !px-3 text-sm">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
            {(['all', 'unread'] as const).map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize', 
                  filter === f ? 'bg-white text-dark-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {f}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-900 mb-1">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'unread' ? "You've read all your notifications" : "You'll see updates here"}
                </p>
              </div>
            )}
            {filtered.map(n => {
              const { icon: Icon, color } = iconMap[n.type] || defaultIcon;
              const isRead = !!n.readAt;
              return (
                <div 
                  key={n.id} 
                  onClick={() => markRead(n.id)} 
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer group', 
                    isRead ? 'bg-white hover:bg-gray-50' : 'bg-brand-50/50 hover:bg-brand-50 border-l-4 border-brand-500'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={cn('text-sm font-semibold truncate', isRead ? 'text-gray-700' : 'text-dark-900')}>
                        {n.title}
                      </p>
                      {!isRead && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{n.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={e => { e.stopPropagation(); remove(n.id); }} 
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
