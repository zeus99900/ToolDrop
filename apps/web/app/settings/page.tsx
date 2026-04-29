'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, MapPin, CreditCard, Bell, Shield, Camera, Save, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'notifications' | 'payment' | 'security';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [firstName, setFirstName] = useState('Dev');
  const [lastName, setLastName] = useState('User');
  const [email] = useState(session?.user?.email || 'dev@tooldrop.ca');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('Toronto');
  const [province, setProvince] = useState('ON');
  const [postalCode, setPostalCode] = useState('');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <><Header /><main className="pt-20 min-h-screen bg-gray-50/50"><div className="section-padding py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account preferences</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={cn('flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap', tab === id ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700')}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'profile' && (<div className="space-y-6 animate-fade-in">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-dark-900">{firstName} {lastName}</p>
                <p className="text-sm text-gray-400">{email}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check className="w-3 h-3" />Email verified</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label><input value={lastName} onChange={e => setLastName(e.target.value)} className="input-field" /></div>
            </div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={email} disabled className="input-field !pl-10 bg-gray-50 text-gray-500 cursor-not-allowed" /></div>
            </div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
              <div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (416) 555-0123" className="input-field !pl-10" /></div>
            </div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell other users about yourself..." className="input-field min-h-[80px] resize-y" maxLength={500} />
              <p className="text-xs text-gray-400 mt-1">{bio.length}/500</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">City</label><input value={city} onChange={e => setCity(e.target.value)} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Province</label><select value={province} onChange={e => setProvince(e.target.value)} className="input-field"><option>ON</option><option>BC</option><option>AB</option><option>QC</option><option>MB</option><option>SK</option><option>NS</option><option>NB</option><option>NL</option><option>PE</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Postal code</label><input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="M5V 1A1" className="input-field" /></div>
            </div>
          </div>)}

          {tab === 'notifications' && (<div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-dark-900">Notification Preferences</h2>
            {[
              { label: 'Email notifications', desc: 'Receive updates via email', checked: emailNotifs, onChange: setEmailNotifs },
              { label: 'Push notifications', desc: 'Browser push alerts', checked: pushNotifs, onChange: setPushNotifs },
              { label: 'Booking updates', desc: 'New bookings, confirmations, returns', checked: bookingNotifs, onChange: setBookingNotifs },
              { label: 'New messages', desc: 'When someone sends you a message', checked: messageNotifs, onChange: setMessageNotifs },
              { label: 'Marketing & tips', desc: 'Product updates and rental tips', checked: marketingNotifs, onChange: setMarketingNotifs },
            ].map(({ label, desc, checked, onChange }) => (
              <label key={label} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <div><p className="text-sm font-medium text-dark-900">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
                <div className={cn('w-11 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer', checked ? 'bg-brand-500' : 'bg-gray-200')} onClick={() => onChange(!checked)}>
                  <div className={cn('w-5 h-5 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-5' : 'translate-x-0')} />
                </div>
              </label>
            ))}
          </div>)}

          {tab === 'payment' && (<div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-dark-900">Payment Methods</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
                <div><p className="text-sm font-medium text-dark-900">•••• •••• •••• 4242</p><p className="text-xs text-gray-400">Expires 12/28</p></div>
                <span className="badge bg-green-100 text-green-700 ml-auto">Default</span>
              </div>
              <button className="btn-secondary text-sm w-full">Add Payment Method</button>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark-900 mb-3">Payout Settings (for lenders)</h3>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><CreditCard className="w-5 h-5 text-emerald-600" /></div>
                  <div><p className="text-sm font-medium text-dark-900">Direct deposit to bank account</p><p className="text-xs text-gray-400">TD Bank · ****6789 · Payouts every Monday</p></div>
                </div>
                <button className="text-sm text-brand-600 font-medium hover:text-brand-700">Update payout method →</button>
              </div>
            </div>
          </div>)}

          {tab === 'security' && (<div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-dark-900">Security</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-dark-900 mb-3">Change Password</h3>
              <div className="space-y-3">
                <input placeholder="Current password" type="password" className="input-field" />
                <input placeholder="New password" type="password" className="input-field" />
                <input placeholder="Confirm new password" type="password" className="input-field" />
              </div>
              <button className="btn-secondary mt-4 text-sm">Update Password</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-dark-900 mb-1">Identity Verification</h3>
              <p className="text-xs text-gray-400 mb-3">Verify your identity to increase trust and unlock instant payouts</p>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 mb-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-700">Verification pending — estimated 24h</p>
              </div>
              <button className="btn-primary text-sm">Complete Verification</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-dark-900 mb-1">Connected Accounts</h3>
              <p className="text-xs text-gray-400 mb-3">Social accounts linked for sign-in</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2"><div className="flex items-center gap-2 text-sm"><svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google</div><span className="text-xs text-gray-400">Not connected</span></div>
              </div>
            </div>

            <div className="p-5 rounded-xl border-2 border-dashed border-red-200 bg-red-50/50">
              <h3 className="text-sm font-semibold text-red-700 mb-1">Danger Zone</h3>
              <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all data</p>
              <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">Delete Account</button>
            </div>
          </div>)}

          {/* Save button */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            {saved && <span className="text-sm text-green-600 flex items-center gap-1"><Check className="w-4 h-4" />Saved successfully</span>}
            <button onClick={handleSave} className="btn-primary"><Save className="w-4 h-4" />Save Changes</button>
          </div>
        </div>
      </div>
    </div></main><Footer /></>
  );
}
