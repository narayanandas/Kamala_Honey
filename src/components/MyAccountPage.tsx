import React, { useState, useEffect } from 'react';
import { useStore } from '../services/storeContext';
import { dbStore } from '../services/dbStore';
import { Order, OrderStatus, NavTab, Product } from '../types';
import { User, ShoppingBag, Heart, Shield, LogOut, LogIn, Save, Clock, ChevronRight } from 'lucide-react';

export const MyAccountPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    loginGoogle,
    logout,
    wishlist,
    products,
    setSelectedProductId,
    setActiveTab
  } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile fields state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Thirunelveli');
  const [pincode, setPincode] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // TAMIL NADU DISTRICT LIST
  const tamilNaduDistricts = [
    'Thirunelveli', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 
    'Kanyakumari', 'Tuticorin', 'Tenkasi', 'Virudhunagar', 'Erode', 'Vellore',
    'Thanjavur', 'Kanchipuram', 'Tiruvallur', 'Tiruppur', 'Dindigul', 'Karur'
  ];

  // Sync state with selected user
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setDistrict(currentUser.district || 'Thirunelveli');
      setPincode(currentUser.pincode || '');

      setLoadingOrders(true);
      dbStore.getOrdersByUserId(currentUser.uid)
        .then(setOrders)
        .finally(() => setLoadingOrders(false));
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedProfile = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      district,
      pincode: pincode.trim()
    };

    await dbStore.saveUserProfile(updatedProfile);
    setCurrentUser(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Resolve products inside wishlist
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Simulated Login helper
  const handleSimulatedDemoLogin = async () => {
    const demoProfile = {
      uid: 'cust-demo',
      email: 'customer@kamalahoney.com',
      name: 'Karthikeyan Bala',
      phone: '9845112233',
      address: '24 South Car Street',
      district: 'Thirunelveli',
      state: 'Tamil Nadu',
      pincode: '627003',
      role: 'customer' as const
    };
    await dbStore.saveUserProfile(demoProfile);
    setCurrentUser(demoProfile);
  };

  if (!currentUser) {
    return (
      <div className="py-16 px-4 max-w-lg mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-5 bg-honey-gold/15 dark:bg-honey-gold/10 rounded-full text-honey-brown dark:text-honey-gold">
            <User size={40} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-honey-brown dark:text-white font-heading">Access Your Kamala Farm Vault</h2>
          <p className="text-xs text-honey-brown/65 dark:text-honey-warm/65 max-w-sm mx-auto leading-relaxed font-sans">
            Log in to edit your shipping address, review past orders, check order dispatch schedules, or load your wishlist items synchronously.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => loginGoogle()}
            className="w-full py-3.5 bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-black hover:text-white dark:hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={14} /> Continue with Google Auth
          </button>
          
          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-honey-brown/10" />
            <span className="flex-shrink mx-3 text-[9px] uppercase font-bold text-honey-brown/40">Or Quick Demo Login</span>
            <div className="flex-grow border-t border-honey-brown/10" />
          </div>

          <button
            onClick={handleSimulatedDemoLogin}
            className="w-full py-3.5 bg-honey-warm/30 dark:bg-charcoal border border-honey-brown/10 text-honey-brown dark:text-honey-warm hover:border-honey-gold/50 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Use Demo Guest Profiler (Karthikeyan Bala)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">
      
      {/* Visual Banner head */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-honey-brown/10 dark:border-honey-gold/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-honey-gold/25 rounded-2xl text-honey-brown font-extrabold font-heading text-lg">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <span className="text-xs text-forest-green font-bold uppercase tracking-widest flex items-center gap-1">
              ✓ Verified {currentUser.role === 'admin' ? 'Administrator' : 'Customer Account'}
            </span>
            <h2 className="text-2xl font-black text-honey-brown dark:text-white font-heading mt-0.5">
              Welcome, {currentUser.name || 'Farming Patron'}
            </h2>
            <p className="text-xs text-honey-brown/50 dark:text-honey-warm/50 font-sans italic">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 hover:bg-red-50 text-red-650 rounded-lg text-xs font-bold border border-red-200/50 flex items-center justify-center gap-1.5 self-start md:self-auto uppercase tracking-wider h-fit"
        >
          <LogOut size={13} /> Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMN LEFT: Shipping details Profile form */}
        <div className="bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 space-y-6">
          <div className="border-b border-honey-brown/5 pb-3">
            <h3 className="font-heading font-black text-sm text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <User size={16} className="text-honey-gold" /> Personal Shipping Info
            </h3>
            <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/50">Edit fields to dynamically auto-fill future checkout orders</p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-forest-green border border-emerald-200 text-xs font-bold rounded-lg font-sans">
              ✓ Shipping configuration updated locally and synced.
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-honey-brown dark:text-honey-gold mb-1">Display Name *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-honey-brown dark:text-honey-gold mb-1">WhatsApp Phone *</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-honey-brown dark:text-honey-gold mb-1">Street Address Coordinates *</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/5 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-honey-brown dark:text-honey-gold mb-1">District / Town</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/5 focus:outline-none"
                >
                  {tamilNaduDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-honey-brown dark:text-honey-gold mb-1">PIN Code *</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/5 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-honey-brown dark:bg-honey-gold text-white dark:text-honey-brown font-black uppercase text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Save size={13} /> Synchronize Profile Settings
            </button>
          </form>

          {currentUser.role === 'admin' && (
            <div className="pt-4 border-t border-honey-brown/10">
              <div className="p-4 bg-honey-gold/15 dark:bg-honey-gold/10 rounded-2xl text-center space-y-2">
                <Shield size={20} className="text-honey-gold mx-auto" />
                <h4 className="text-xs font-black uppercase text-honey-brown dark:text-honey-gold">Administrator Controls Access</h4>
                <p className="text-[10px] text-honey-brown/70 leading-normal font-sans">
                  Your profile possesses database master clearance metrics. Click the dashboard tab above to modify orders.
                </p>
                <button
                  onClick={() => setActiveTab(NavTab.ADMIN)}
                  className="mt-1 px-3 py-1.5 bg-honey-brown text-white text-[10px] uppercase font-bold tracking-wider rounded"
                >
                  Launch Admin Console
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLUMN RIGHT: Orders History log and Wishlist */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ORDERS HISTORY WINDOW */}
          <div className="bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 space-y-4">
            <h3 className="font-heading font-black text-sm text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-honey-brown/5 pb-3">
              <ShoppingBag size={16} className="text-honey-gold" /> Previous Order Invoices ({orders.length})
            </h3>

            {loadingOrders ? (
              <p className="text-xs text-honey-brown/40 italic py-4">Fetching previous invoice files from secure archives...</p>
            ) : orders.length === 0 ? (
              <div className="py-6 text-center space-y-1.5">
                <p className="text-xs text-honey-brown/50 dark:text-honey-warm/50 italic">No order invoices mapped to this profile yet.</p>
                <p className="text-[10px] text-honey-brown/40 font-semibold uppercase hover:underline cursor-pointer" onClick={() => setActiveTab(NavTab.SHOP)}>Shop raw honey selections now</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-4 border border-honey-brown/5 dark:border-honey-gold/10 rounded-2xl bg-honey-warm/5 relative space-y-3 pt-4"
                  >
                    {/* Floating Status Indicator tag */}
                    <span className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ord.status === OrderStatus.DELIVERED ? 'bg-emerald-50 text-emerald-700' :
                      ord.status === OrderStatus.SHIPPED ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      ● {ord.status}
                    </span>

                    <div className="space-y-0.5 text-xs font-sans">
                      <span className="text-[10px] text-honey-brown/40 font-mono tracking-wider uppercase block">Order Invoice</span>
                      <p className="font-bold text-honey-brown dark:text-white">ID: <span className="font-mono">{ord.orderId}</span></p>
                      <p className="text-[10px] text-honey-brown/50 flex items-center gap-1"><Clock size={11} /> {new Date(ord.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="border-t border-honey-brown/5 pt-2 text-xs space-y-1 bg-white/50 p-2.5 rounded-xl border border-honey-brown/5">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-honey-brown/85 font-medium line-clamp-1">{item.name} <span className="text-[10px] text-honey-brown/50">x{item.quantity}</span></span>
                          <span className="font-mono text-[10px] font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-honey-brown/50">Total Amount:</span>
                      <span className="text-sm font-black text-honey-brown dark:text-honey-gold font-mono">₹{ord.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WISHLIST COLLECTION TRACKER */}
          <div className="bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 space-y-4">
            <h3 className="font-heading font-black text-sm text-honey-brown dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-honey-brown/5 pb-3">
              <Heart size={16} className="text-honey-gold" /> Wishlisted Items ({wishlistProducts.length})
            </h3>

            {wishlistProducts.length === 0 ? (
              <p className="text-xs text-honey-brown/50 dark:text-honey-warm/50 italic py-2 text-center">Your wishlist cart remains unselected. Click heart indicators in catalog!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className="p-2 border border-honey-brown/5 rounded-xl hover:bg-honey-gold/10 cursor-pointer space-y-1.5 transition text-center"
                    title="Click to view full details"
                  >
                    <img 
                      src={p.image} 
                      alt="" 
                      className="w-16 h-16 object-cover rounded-lg mx-auto border border-honey-brown/5 shadow-sm" 
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="text-[11px] font-black text-honey-brown dark:text-white truncate">{p.name}</h4>
                    <p className="text-[10px] font-mono text-honey-gold font-bold">₹{p.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
