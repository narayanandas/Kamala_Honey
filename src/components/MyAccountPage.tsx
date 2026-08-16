import React, { useState, useEffect } from 'react';
import { useStore } from '../services/storeContext';
import { dbStore } from '../services/dbStore';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { 
  User, 
  Shield, 
  Lock, 
  Mail, 
  Phone, 
  RefreshCw, 
  KeyRound, 
  LogIn, 
  UserPlus, 
  ArrowLeft, 
  LogOut, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Database,
  ShoppingBag
} from 'lucide-react';
import { NavTab, UserProfile } from '../types';

export const MyAccountPage: React.FC = () => {
  const {
    currentUser,
    loginWithEmailAndPassword,
    signUpWithEmailAndPassword,
    loginAdminWithPhoneAndPassword,
    resetAdminPassword,
    resetPasswordForEmail,
    updateProfile,
    logout,
    setActiveTab
  } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'admin-phone' | 'reset'>('signin');
  
  // Sign In / Sign Up Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState<'customer' | 'admin'>('customer');
  
  // Reset Password states
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Profile editing for logged in user
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileDistrict, setProfileDistrict] = useState('Thirunelveli');
  const [profilePincode, setProfilePincode] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync profile editing values when user changes
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileAddress(currentUser.address || '');
      setProfileDistrict(currentUser.district || 'Thirunelveli');
      setProfilePincode(currentUser.pincode || '');
    }
  }, [currentUser]);

  // Clear messages on mode switch
  useEffect(() => {
    setAuthError(null);
    setAuthSuccess(null);
  }, [mode]);

  // Handle Supabase Email + Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const res = await loginWithEmailAndPassword(email.trim(), password.trim());
      if (res.success) {
        setAuthSuccess('Signed in successfully via Supabase Auth!');
      } else {
        setAuthError(res.message || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Supabase Email + Password Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) {
      setAuthError('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const res = await signUpWithEmailAndPassword(
        email.trim(),
        password.trim(),
        name.trim(),
        phone.trim(),
        accountType
      );
      if (res.success) {
        setAuthSuccess(res.message || 'Account created successfully in Supabase! You are now logged in.');
      } else {
        setAuthError(res.message || 'Registration error. Please check your details.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Phone + Password Sign In
  const handleAdminPhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setAuthError('Please enter both your registered phone number and admin password.');
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
        setAuthError('Access denied. No admin record matching this phone number and password.');
      }
    } catch (err: any) {
      setAuthError(`Authentication error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      setAuthError('Please provide your registered email or phone number.');
      return;
    }

    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      if (resetIdentifier.includes('@')) {
        // Supabase Email Reset
        const res = await resetPasswordForEmail(resetIdentifier.trim());
        if (res.success) {
          setAuthSuccess(res.message);
        } else {
          setAuthError(res.message);
        }
      } else {
        // Phone reset with new password
        if (!newPassword || newPassword !== confirmPassword) {
          setAuthError('Please ensure your new passwords match.');
          setLoading(false);
          return;
        }
        const success = await resetAdminPassword(resetIdentifier.trim(), newPassword.trim());
        if (success) {
          setAuthSuccess('Password updated successfully! Please sign in with your new password.');
          setMode('signin');
        } else {
          setAuthError('Reset failed. Phone number not found in database records.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        address: profileAddress.trim(),
        district: profileDistrict.trim(),
        pincode: profilePincode.trim()
      });
      setAuthSuccess('Profile updated successfully in Supabase database!');
      setEditingProfile(false);
    } catch (err: any) {
      setAuthError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // TAMIL NADU DISTRICT LIST
  const tamilNaduDistricts = [
    'Thirunelveli', 'Tenkasi', 'Tuticorin', 'Kanyakumari', 'Madurai', 'Chennai', 
    'Coimbatore', 'Trichy', 'Salem', 'Virudhunagar', 'Erode', 'Vellore',
    'Thanjavur', 'Kanchipuram', 'Tiruvallur', 'Tiruppur', 'Dindigul', 'Karur'
  ];

  // -------------------------------------------------------------
  // NOT LOGGED IN STATE
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto animate-fade-in space-y-6">
        
        {/* Brand & Supabase Status Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-honey-gold/10 text-honey-gold rounded-2xl border border-honey-gold/20 shadow-inner">
            <Shield size={32} />
          </div>
          
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[11px] font-bold border border-emerald-500/20">
              <Database size={12} />
              <span>Supabase Auth Integrated</span>
            </div>
            <h2 className="text-2xl font-heading font-black text-honey-brown dark:text-white">
              {mode === 'signin' && 'Sign In to Kamala Farm'}
              {mode === 'signup' && 'Create Supabase Account'}
              {mode === 'admin-phone' && 'Admin Phone Access'}
              {mode === 'reset' && 'Reset Account Password'}
            </h2>
            <p className="text-xs text-honey-brown/70 dark:text-honey-warm/60 max-w-sm mx-auto leading-relaxed">
              {mode === 'signin' && 'Access orders, saved honey items, and authorized admin tools.'}
              {mode === 'signup' && 'Register your profile with Supabase Authentication.'}
              {mode === 'admin-phone' && 'Fast direct WhatsApp phone sign-in for farm administrators.'}
              {mode === 'reset' && 'Receive password recovery instructions.'}
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-honey-warm/20 dark:bg-black/40 rounded-2xl border border-honey-brown/10 dark:border-honey-gold/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 px-2 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown shadow'
                : 'text-honey-brown/70 dark:text-honey-warm/70 hover:text-honey-brown'
            }`}
          >
            <LogIn size={13} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 px-2 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown shadow'
                : 'text-honey-brown/70 dark:text-honey-warm/70 hover:text-honey-brown'
            }`}
          >
            <UserPlus size={13} /> Sign Up
          </button>
          <button
            type="button"
            onClick={() => setMode('admin-phone')}
            className={`py-2 px-2 rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 ${
              mode === 'admin-phone'
                ? 'bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown shadow'
                : 'text-honey-brown/70 dark:text-honey-warm/70 hover:text-honey-brown'
            }`}
          >
            <Phone size={13} /> Admin Phone
          </button>
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

        {/* Forms Card */}
        <div className="bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/10 dark:border-honey-gold/10 shadow-2xl transition-all duration-300">
          
          {/* 1. SUPABASE EMAIL & PASSWORD SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="email"
                    placeholder="e.g. user@example.com or admin@kamalahoney.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetIdentifier(email);
                      setMode('reset');
                    }}
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
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-honey-brown dark:bg-honey-gold hover:opacity-90 active:scale-[0.99] text-white dark:text-honey-brown font-black uppercase text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Authenticating with Supabase...
                  </>
                ) : (
                  <>
                    <LogIn size={14} /> Sign In with Supabase Auth
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-honey-gold hover:underline"
                  >
                    Sign Up here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 2. SUPABASE SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Kannan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  WhatsApp Phone Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9845112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\s+/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Create Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`py-2 px-3 rounded-xl border font-bold text-center transition ${
                      accountType === 'customer'
                        ? 'border-honey-gold bg-honey-gold/10 text-honey-brown dark:text-honey-gold'
                        : 'border-honey-brown/10 text-honey-brown/60 dark:text-honey-warm/60'
                    }`}
                  >
                    🐝 Customer / Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('admin')}
                    className={`py-2 px-3 rounded-xl border font-bold text-center transition ${
                      accountType === 'admin'
                        ? 'border-forest-green bg-forest-green/10 text-forest-green'
                        : 'border-honey-brown/10 text-honey-brown/60 dark:text-honey-warm/60'
                    }`}
                  >
                    🛡️ Farm Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-3 bg-forest-green hover:opacity-90 active:scale-[0.99] text-white font-black uppercase text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Creating Supabase Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={14} /> Create Supabase Account
                  </>
                )}
              </button>

              <div className="pt-1 text-center">
                <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="font-bold text-honey-gold hover:underline"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 3. ADMIN PHONE & WHATSAPP SIGN IN */}
          {mode === 'admin-phone' && (
            <form onSubmit={handleAdminPhoneSignIn} className="space-y-4">
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
                    onClick={() => {
                      setResetIdentifier(phone);
                      setMode('reset');
                    }}
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
          )}

          {/* 4. RESET PASSWORD */}
          {mode === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                  Registered Email or Phone Number
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                  <input
                    required
                    type="text"
                    placeholder="Provide registered email or phone"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                  />
                </div>
                <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40">
                  If an email is entered, a Supabase recovery link is sent. If phone is entered, specify your new password below.
                </p>
              </div>

              {!resetIdentifier.includes('@') && resetIdentifier.length > 0 && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative">
                      <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                      <input
                        required
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey-brown/40 dark:text-honey-warm/40" />
                      <input
                        required
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm placeholder-honey-brown/30 focus:outline-none focus:ring-1 focus:ring-honey-gold"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-honey-brown/15 dark:border-honey-gold/15 dark:text-honey-warm hover:bg-black/10 rounded-xl text-xs font-bold"
                >
                  <ArrowLeft size={13} /> Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow py-2.5 bg-honey-brown dark:bg-honey-gold text-white dark:text-honey-brown font-black uppercase text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={13} /> Reset Password
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

  // -------------------------------------------------------------
  // LOGGED IN USER PROFILE SECTION
  // -------------------------------------------------------------
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="py-12 px-4 mx-auto max-w-2xl space-y-6 animate-fade-in">
      
      {/* Top Profile Card */}
      <div className="bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/10 dark:border-honey-gold/10 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className={`p-4 rounded-2xl border ${
            isAdmin 
              ? 'bg-forest-green/10 text-forest-green border-forest-green/30' 
              : 'bg-honey-gold/10 text-honey-gold border-honey-gold/30'
          }`}>
            {isAdmin ? <Shield size={40} /> : <User size={40} />}
          </div>

          <div className="flex-grow space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-honey-brown dark:text-white capitalize">
                {currentUser.name}
              </h2>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isAdmin 
                  ? 'bg-forest-green text-white' 
                  : 'bg-honey-gold/20 text-honey-brown dark:text-honey-gold border border-honey-gold/30'
              }`}>
                {isAdmin ? '🛡️ Administrator' : '🐝 Verified Customer'}
              </span>
            </div>

            <p className="text-xs text-honey-brown/70 dark:text-honey-warm/70">
              {currentUser.email || 'No email associated'} • {currentUser.phone || 'No phone registered'}
            </p>

            <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Auth Session Synchronized</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/20 flex items-center gap-1.5 transition shrink-0"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        {/* Quick Notification */}
        {authSuccess && (
          <div className="p-3 bg-forest-green/15 border border-forest-green/20 text-emerald-500 text-xs font-semibold rounded-2xl text-center">
            ✓ {authSuccess}
          </div>
        )}

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {isAdmin && (
            <button
              onClick={() => setActiveTab(NavTab.ADMIN)}
              className="py-3 px-4 bg-forest-green hover:bg-emerald-700 text-white font-extrabold uppercase text-xs rounded-xl flex items-center justify-center gap-2 shadow transition"
            >
              🛠️ Open Admin Management Suite
            </button>
          )}
          
          <button
            onClick={() => setActiveTab(NavTab.SHOP)}
            className="py-3 px-4 bg-honey-brown dark:bg-honey-gold hover:opacity-90 text-white dark:text-honey-brown font-extrabold uppercase text-xs rounded-xl flex items-center justify-center gap-2 shadow transition"
          >
            <ShoppingBag size={14} /> Shop Raw Wild Honey
          </button>
        </div>

        {/* User Details & Delivery Address Sync */}
        <div className="border-t border-honey-brown/10 dark:border-honey-gold/10 pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-honey-brown dark:text-honey-gold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={15} /> Saved Shipping & Profile Details
            </h3>
            <button
              type="button"
              onClick={() => setEditingProfile(!editingProfile)}
              className="text-xs font-bold text-honey-gold hover:underline"
            >
              {editingProfile ? 'Cancel Editing' : 'Edit Details'}
            </button>
          </div>

          {editingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-honey-brown/70 dark:text-honey-warm/70 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-honey-brown/70 dark:text-honey-warm/70 uppercase">
                    WhatsApp Phone
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-honey-brown/70 dark:text-honey-warm/70 uppercase">
                  Door No, Street & Area Address
                </label>
                <textarea
                  rows={2}
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder="e.g. 24 South Car Street, Near Nellaiyappar Temple"
                  className="w-full mt-1 px-3 py-2 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-honey-brown/70 dark:text-honey-warm/70 uppercase">
                    Tamil Nadu District
                  </label>
                  <select
                    value={profileDistrict}
                    onChange={(e) => setProfileDistrict(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10 text-honey-brown dark:text-honey-warm"
                  >
                    {tamilNaduDistricts.map(dist => (
                      <option key={dist} value={dist} className="bg-white dark:bg-charcoal text-black dark:text-white">
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-honey-brown/70 dark:text-honey-warm/70 uppercase">
                    PIN Code (6 digits)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={profilePincode}
                    onChange={(e) => setProfilePincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 627001"
                    className="w-full mt-1 px-3 py-2 bg-honey-warm/10 dark:bg-black/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 bg-forest-green text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
              >
                {loading ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                Save Changes to Supabase
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-honey-warm/10 dark:bg-black/30 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-honey-brown/50 dark:text-honey-warm/50">
                  Default Delivery Location
                </span>
                <p className="font-semibold text-honey-brown dark:text-honey-warm">
                  {currentUser.address ? `${currentUser.address}, ${currentUser.district}` : 'No street address saved yet'}
                </p>
                <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60">
                  {currentUser.pincode ? `PIN: ${currentUser.pincode}, Tamil Nadu` : 'Tamil Nadu'}
                </p>
              </div>

              <div className="p-3.5 bg-honey-warm/10 dark:bg-black/30 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-honey-brown/50 dark:text-honey-warm/50">
                  Linked Contact Numbers
                </span>
                <p className="font-semibold text-honey-brown dark:text-honey-warm">
                  WhatsApp: {currentUser.phone || 'None'}
                </p>
                <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60">
                  Email: {currentUser.email || 'None'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
