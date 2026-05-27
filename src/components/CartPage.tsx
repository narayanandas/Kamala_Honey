import React, { useState } from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { Trash2, ArrowLeft, ShieldCheck, Ticket, ShoppingBag, Info, Gift, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotalBeforeCoupon,
    cartTotalAfterCoupon,
    shippingCost,
    couponCode,
    applyCoupon,
    setActiveTab
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    
    const success = applyCoupon(inputCoupon);
    if (success) {
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try "HONEY10" for 10% off!');
      setCouponSuccess(false);
    }
  };

  const discountAmount = cartTotalBeforeCoupon * (couponCode === 'HONEY10' ? 0.1 : couponCode === 'FESTIVE15' ? 0.15 : 0);

  const handleBulkOrderWhatsApp = () => {
    const cartText = cart.map(item => `• ${item.name} x${item.quantity} (₹${item.price * item.quantity})`).join('\n');
    const discountText = couponCode ? `\nCoupon Applied (${couponCode}): -₹${discountAmount.toFixed(0)}` : '';
    const shippingText = shippingCost === 0 ? 'FREE' : `₹${shippingCost}`;
    const whatsappText = `*KAMALA HONEY - Bulk/Wholesale Order Inquiry*\n\nMy Cart Contents:\n${cartText}${discountText}\nTamil Nadu Flat Freight: ${shippingText}\n*Total Invoice Price: ₹${cartTotalAfterCoupon.toFixed(0)}*\n\nHello Kamala Farm, I am interested in placing a bulk or wholesale inquiry for these selected natural products. Please let me know the customized wholesale pricing scale and freight schedules!`;
    
    window.open(`https://wa.me/917708510872?text=${encodeURIComponent(whatsappText)}`, '_blank', 'noreferrer,noopener');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-6 bg-honey-gold/15 dark:bg-honey-gold/10 rounded-full text-honey-gold animate-bounce">
            <ShoppingBag size={48} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-honey-brown dark:text-white font-heading">Your cart is empty!</h2>
        <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60 max-w-sm mx-auto">
          We haven't added any sweet farm-fresh nectars yet. Explore our traditional range sourced directly from Thirunelveli!
        </p>
        <button
          onClick={() => setActiveTab(NavTab.SHOP)}
          className="px-6 py-3.5 bg-honey-gold text-honey-brown rounded-xl text-xs font-black uppercase tracking-wider shadow hover:bg-honey-brown hover:text-white transition-all"
        >
          Browse Shop Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      <div className="flex items-center gap-2 mb-8 cursor-pointer text-honey-brown/60 dark:text-honey-warm/60 hover:text-honey-brown" onClick={() => setActiveTab(NavTab.SHOP)}>
        <ArrowLeft size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">Continue Shopping</span>
      </div>

      <h2 className="text-2xl font-black text-honey-brown dark:text-white font-heading mb-6">
        Review Your Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN LEFT: Cart Items list */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-4 bg-white dark:bg-charcoal border border-honey-brown/5 dark:border-honey-gold/10 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                {/* Visual Cover Photo */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-honey-brown/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-heading font-black text-sm text-honey-brown dark:text-white">{item.name}</h3>
                    <p className="text-[11px] font-bold text-honey-brown/60 italic">{item.tamilName}</p>
                    <p className="text-xs font-bold text-honey-gold font-mono pt-1">₹{item.price} per jar</p>
                  </div>
                </div>

                {/* Operations & Qty adjustments */}
                <div className="flex items-center justify-between sm:justify-start gap-6 w-full sm:w-auto border-t sm:border-t-0 border-honey-brown/5 pt-3 sm:pt-0">
                  
                  <div className="flex items-center border border-honey-brown/15 rounded-lg bg-honey-warm/15 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs font-black text-honey-brown hover:bg-honey-gold/10"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-mono text-xs font-bold text-honey-brown dark:text-honey-warm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs font-black text-honey-brown hover:bg-honey-gold/10"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-honey-brown dark:text-honey-gold font-mono">
                      ₹{item.price * item.quantity}
                    </p>
                    <span className="text-[10px] text-honey-brown/50">Subtotal</span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-honey-brown/40 hover:text-red-500 rounded-lg hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {/* Quick promotion alerts */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 flex gap-3">
            <Info className="text-honey-gold shrink-0 mt-0.5" size={16} />
            <div className="space-y-1">
              <span className="text-xs font-bold text-honey-brown">Express Delivery Incentives</span>
              <p className="text-[11px] text-honey-brown/70 leading-relaxed font-sans">
                Order goods worth ₹1000 or above to unlock **FREE door-step shipping** anywhere in Tamil Nadu. Add extra items to save ₹50 freight charges!
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN RIGHT: Totals & Billing overview */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Order Summary Billing Card */}
          <div className="p-6 bg-white dark:bg-charcoal border border-honey-brown/5 dark:border-honey-gold/10 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-heading font-black text-sm text-honey-brown dark:text-white uppercase tracking-wider border-b border-honey-brown/5 pb-3">
              Order Subtotal
            </h3>

            <div className="space-y-2.5 text-xs text-honey-brown/80 dark:text-honey-warm/80">
              <div className="flex justify-between">
                <span>Products Gross Amount:</span>
                <span className="font-mono font-bold">₹{cartTotalBeforeCoupon}</span>
              </div>
              
              {couponCode && (
                <div className="flex justify-between text-forest-green font-bold bg-green-50 px-2 py-1 rounded">
                  <span className="flex items-center gap-1"><Gift size={12} /> Coupon "{couponCode}":</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1">Tamil Nadu Flat Freight:</span>
                <span className="font-mono font-bold">
                  {shippingCost === 0 ? <span className="text-forest-green uppercase font-semibold">FREE</span> : `₹${shippingCost}`}
                </span>
              </div>
            </div>

            <div className="border-t border-honey-brown/10 pt-3 flex justify-between items-baseline">
              <span className="text-xs font-black uppercase text-honey-brown dark:text-honey-gold">Total (INR):</span>
              <span className="text-2xl font-black text-honey-brown dark:text-honey-gold font-mono">
                ₹{cartTotalAfterCoupon}
              </span>
            </div>

            {/* Custom Promo Coupons submission box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-4 border-t border-honey-brown/5">
              <label className="block text-[10px] font-black uppercase text-honey-brown/60 tracking-wider">Applied Coupon Disc.</label>
              
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Ticket size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-honey-brown/40" />
                  <input
                    type="text"
                    placeholder="ENTER HONEY10"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-honey-warm/25 text-xs rounded border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none uppercase font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-honey-brown dark:bg-honey-gold text-white dark:text-honey-brown font-bold text-xs rounded uppercase hover:bg-black"
                >
                  Apply
                </button>
              </div>

              {couponError && <p className="text-[10px] font-semibold text-red-500 font-sans">{couponError}</p>}
              {couponSuccess && (
                <p className="text-[10px] font-semibold text-forest-green font-sans flex items-center gap-1">
                  ✓ Code credited successfully! Try "FESTIVE15" for bigger discounts.
                </p>
              )}
            </form>

            {/* Checkout proceed CTA */}
            <button
              onClick={() => setActiveTab(NavTab.CHECKOUT)}
              className="w-full py-4 rounded-xl bg-[#4E2F12] hover:bg-black text-white font-extrabold tracking-wider text-xs uppercase shadow transition-colors"
            >
              Confirm Checkout Order ➔
            </button>

            {/* Bulk Order WhatsApp pre-filled CTA */}
            <button
              onClick={handleBulkOrderWhatsApp}
              className="w-full py-3.5 rounded-xl border-2 border-[#2E7D32] hover:bg-[#2E7D32] hover:text-white text-[#2E7D32] font-extrabold tracking-wider text-xs uppercase transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} />
              Inquire Bulk Order (WhatsApp)
            </button>

            <div className="text-center pt-2">
              <p className="text-[10px] text-honey-brown/40 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-forest-green" /> Authenticated via SSL Security
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
