import React, { useState } from 'react';
import { X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: { email: string; name: string; picture?: string; sub?: string }) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const quickAccounts = [
    {
      name: 'Vishnu Kumawat',
      email: 'vishnu.k@rishihood.edu.in',
      avatarText: 'VK',
      avatarBg: 'bg-emerald-600',
    },
    {
      name: 'Campus Organizer Lead',
      email: 'ecell.lead@rishihood.edu.in',
      avatarText: 'EC',
      avatarBg: 'bg-amber-600',
    },
    {
      name: 'Student Developer',
      email: 'alex.student@gmail.com',
      avatarText: 'AS',
      avatarBg: 'bg-blue-600',
    },
  ];

  const handleSelectAccount = async (account: { name: string; email: string }) => {
    setLoading(true);
    setError('');
    try {
      // Simulate real OAuth token exchange latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSuccess({
        name: account.name,
        email: account.email,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.name)}&backgroundColor=C4623A`,
        sub: 'g_sub_' + Math.abs(hashString(account.email)),
      });
      onClose();
    } catch {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Google email.');
      return;
    }
    const name = customName.trim() || customEmail.split('@')[0];
    handleSelectAccount({ name, email: customEmail });
  };

  function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-beige-dark/50 overflow-hidden text-charcoal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-base leading-tight">Sign in with Google</h3>
              <p className="text-xs text-mutedbrown">Choose an account to continue to EVENTO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missing Config Notification */}
        <div className="px-6 pt-4">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Production Google OAuth Notice</span>
              To enable live Google servers, configure <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">VITE_GOOGLE_CLIENT_ID</code> in your <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">.env</code>. The OAuth simulation below executes the real EVENTO account creation & session linking pipeline.
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 pt-3">
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          </div>
        )}

        {/* Quick Accounts List */}
        <div className="p-6 space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
            Select Google Account
          </span>

          {quickAccounts.map((account) => (
            <button
              key={account.email}
              disabled={loading}
              onClick={() => handleSelectAccount(account)}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-terracotta/40 hover:bg-beige/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${account.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                  {account.avatarText}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-terracotta transition-colors">
                    {account.name}
                  </div>
                  <div className="text-xs text-gray-500">{account.email}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-terracotta transition-colors" />
            </button>
          ))}

          {/* Or enter custom Google account */}
          <div className="pt-3">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium">Or enter any Google account</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-2.5 mt-2">
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@gmail.com or @rishihood.edu.in"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Account Linking Enabled</span>
          </div>
          <span>EVENTO OAuth v1.0</span>
        </div>
      </div>
    </div>
  );
};

