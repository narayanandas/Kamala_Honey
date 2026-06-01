import React, { useState, useEffect } from 'react';
import { useStore } from '../services/storeContext';
import { dbStore } from '../services/dbStore';
import { User, Shield, Lock, Phone, RefreshCw, KeyRound, LogIn, ArrowLeft, LogOut } from 'lucide-react';
import { NavTab } from '../types';

export const MyAccountPage: React.FC = () => {
  const {
    currentUser,
    loginAdminWithPhoneAndPassword,
    resetAdminPassword,
    logout,
    setActiveTab
  } = useStore();

  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clear notifications on mode swap
  useEffect(() => {
    setAuthError(null);
    setAuthSuccess(null);
  }, [mode]);

  const handleAdminSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setAuthError('Please fill in both your registered phone number and password.');
      return;
    }

    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const success = await loginAdminWithPhoneAndPassword(phone.trim(), password.trim());
      if (success) {
        setAuthSuccess('Administrator authenticated successfully.');
      } else {
        setAuthError('Access denied. Invalid phone number or password associated with an admin account.');
      }
    } catch (err: any) {
      setAuthError(`Authentication error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminPasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setAuthError('Please fill out all the configuration fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setAuthError('Mismatch: Your new passwords do not match.');
      return;
    }

    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const success = await resetAdminPassword(phone.trim(), newPassword.trim());
      if (success) {
        setAuthSuccess('Administrator password updated successfully. Please enter your new password to sign in.');
        setMode('login');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setAuthError('Reset failed. Phone number not matched against any administrator records.');
      }
    } catch (err: any) {
      setAuthError(`Reset error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto animate-fade-in space-y-6">
        
        {/* Visual Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 bg-honey-gold/10 text-honey-gold rounded-full border border-honey-gold/20 shadow-inner">
            <Shield size={36} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-honey-brown/60 dark:text-honey-warm/60 uppercase tracking-widest font-black">
              KAMALA HONEY CO
            </span>
            <h2 className="text-2xl font-heading font-black text-honey-brown dark:text-white">
              {mode === 'login' ? 'Admin Master Portal' : 'Reset Master Password'}
            </h2>
            <p className="text-xs text-honey-brown/70 dark:text-honey-warm/60 max-w-sm mx-auto leading-relaxed">
              {mode === 'login' 
                ? 'Authenticate secure session using authorized phone credentials'
                : 'Modify administrative credentials across secure data vaults'
              }
            </p>
          </div>
        </div>

        {/* Notifications */}
        {authError && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold rounded-2xl leading-relaxed text-center">
            ⚠️ {authError}
          </div>
        )}
        {authSuccess && (
          <div className="p-3.5 bg-forest-green/15 border border-forest-green/20 text-emerald-500 text-xs font-semibold rounded-2xl leading-relaxed text-center">
            ✓ {authSuccess}
          </div>
        )}

        {/* Login Form Wrapper */}
        <div className="bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/10 dark:border-honey-gold/10 shadow-2xl hover:border-honey-gold/20 transition-all duration-300">
          
          {mode === 'login' ? (
            <form onSubmit={handleAdminSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Admin Phone Number [WhatsApp]
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 7708510872"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
                <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-mono">Default: 7708510872</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                    Sign In Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[10px] font-bold text-[#D4A017] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
                <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 font-mono">Default: admin123</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-honey-brown dark:bg-honey-gold hover:opacity-90 active:scale-[0.99] text-white dark:text-honey-brown font-black uppercase text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Validating Authorized Credentials...
                  </>
                ) : (
                  <>
                    <LogIn size={14} /> Open Admin Session Vault
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminPasswordResetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Administrative Phone Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="tel"
                    placeholder="Provide registered phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  New Secure Password
                </label>
                <div className="relative">
                  <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="password"
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="password"
                    placeholder="Re-enter password to match"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-honey-brown/15 dark:border-honey-gold/15 dark:text-honey-warm hover:bg-black/10 rounded-xl text-xs font-bold"
                >
                  <ArrowLeft size={13} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow py-2.5 bg-honey-brown dark:bg-honey-gold text-white dark:text-honey-brown font-black uppercase text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Updating Vault Password...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={13} /> Update Credentials
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    );
  }

  // Active Authenticated Admin View Section
  return (
    <div className="py-16 px-4 mx-auto max-w-xl text-center space-y-6 animate-fade-in animate-duration-300">
      <div className="inline-flex p-4 bg-forest-green/10 text-forest-green rounded-full border border-forest-green/30 animate-pulse">
        <Shield size={44} />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] bg-forest-green/10 text-emerald-500 font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
          Authorized Admin Active
        </span>
        <h2 className="text-2xl font-black text-honey-brown dark:text-white capitalize">
          Welcome, {currentUser.name}
        </h2>
        <p className="text-xs text-honey-brown/65 dark:text-honey-warm/65 max-w-md mx-auto leading-relaxed">
          Your admin session is fully authorized and signed in from WhatsApp phone link: <span className="font-mono text-honey-gold font-bold">{currentUser.phone}</span>
        </p>
      </div>

      <div className="bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/10 dark:border-honey-gold/10 space-y-4">
        <div className="text-left text-xs font-semibold space-y-2.5">
          <div className="flex justify-between border-b border-honey-brown/5 pb-2">
            <span className="text-honey-brown/50 dark:text-honey-warm/50 font-bold uppercase">Role Title</span>
            <span className="text-forest-green uppercase tracking-wide">Primary Admin</span>
          </div>
          <div className="flex justify-between border-b border-honey-brown/5 pb-2">
            <span className="text-honey-brown/50 dark:text-honey-warm/50 font-bold uppercase">Linked Mail</span>
            <span className="text-honey-brown dark:text-honey-warm">{currentUser.email}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-honey-brown/50 dark:text-honey-warm/50 font-bold uppercase">Farm Gate Location</span>
            <span className="text-honey-brown dark:text-honey-warm">Thirunelveli, TN</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-4">
          <button
            onClick={() => setActiveTab(NavTab.ADMIN)}
            className="flex-grow py-3 bg-forest-green text-white font-extrabold uppercase text-xs rounded-xl flex items-center justify-center gap-1.5 shadow hover:bg-emerald-700 transition"
          >
            🛠️ Launch Admin Dashboard
          </button>
          
          <button
            onClick={logout}
            className="px-5 py-3 hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-extrabold border border-red-500/10 hover:border-red-500/30 flex items-center justify-center gap-1.5 transition"
          >
            <LogOut size={14} /> End Session
          </button>
        </div>
      </div>
    </div>
  );
};
