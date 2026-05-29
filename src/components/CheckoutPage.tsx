import React, { useState } from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { ShieldCheck, ArrowLeft, Send, CheckCircle2, MessageCircle, MapPin, ClipboardList } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotalAfterCoupon,
    placeOrder,
    currentUser,
    setActiveTab,
    couponCode,
    shippingCost,
    cartTotalBeforeCoupon
  } = useStore();

  // Form inputs
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Thirunelveli');
  const [state] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  // TAMIL NADU DISTRICT LIST
  const tamilNaduDistricts = [
    'Thirunelveli', 'Tenkasi', 'Tuticorin', 'Kanyakumari', 'Madurai', 'Chennai', 
    'Coimbatore', 'Trichy', 'Salem', 'Virudhunagar', 'Erode', 'Vellore',
    'Thanjavur', 'Kanchipuram', 'Tiruvallur', 'Tiruppur', 'Dindigul', 'Karur'
  ];

  // WhatsApp Message Formatter
  const getWhatsAppCheckoutMessage = (orderId: string, itemsList: any[], totalAmt: number) => {
    const itemsText = itemsList.map((item, idx) => `  ${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    const discountText = couponCode ? `\n🎁 *Coupon Code:* ${couponCode}` : '';
    
    return `*KAMALA NATURAL HONEY FARM - NEW ORDER* 🍯
---------------------------------------------
*Order ID:* ${orderId}

👤 *Customer Details:*
• *Name:* ${name}
• *WhatsApp Phone:* ${phone}

📍 *Delivery Location:*
• *Address:* ${address}
• *District/Region:* ${district}
• *State:* ${state}
• *PIN Code:* ${pincode}

📦 *Ordered Items Catalog:*
${itemsText}

---------------------------------------------
⭐ *Tamil Nadu Freight:* ${shippingCost === 0 ? 'FREE Shipping' : `₹${shippingCost}`} ${discountText}
💰 *Total Outstanding Invoice Amount:* ₹${totalAmt}
---------------------------------------------

Hello Kamala Farm, I have just completed my order details on your app. Please verify my delivery pin codes and guide me with the immediate dispatch/payment instructions! Thank you!`;
  };

  const handleWhatsAppCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert('Please fill out all delivery and contact details fields.');
      return;
    }
    if (pincode.trim().length !== 6) {
      alert('Tamil Nadu PIN codes must be exactly 6 digits.');
      return;
    }

    setSubmitting(true);
    try {
      // Create order locally in the LocalStorage DB
      const order = await placeOrder({
        name,
        phone,
        address,
        district,
        state,
        pincode,
        paymentProof: 'WhatsApp Direct Fulfill' // Set explicit indicator that no raw billing block is required
      });

      setSubmittedOrder(order);
      setSubmitting(false);

      // Instantly open WhatsApp API redirect
      const message = getWhatsAppCheckoutMessage(order.orderId, order.items, order.totalAmount);
      const link = `https://wa.me/917708510872?text=${encodeURIComponent(message)}`;
      window.open(link, '_blank', 'noreferrer,noopener');
    } catch (err) {
      console.error(err);
      alert('Unable to process local checkout. Try again.');
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !submittedOrder) {
    return (
      <div className="py-20 px-4 max-w-7xl mx-auto text-center space-y-4">
        <span className="text-3xl">🍯</span>
        <h3 className="text-lg font-black text-honey-brown dark:text-white">Your Checkout Cart is Empty</h3>
        <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60 max-w-sm mx-auto font-sans leading-relaxed">
          Please add delicious items from our catalog into your cart before proceeding to WhatsApp coordinates verification.
        </p>
        <button
          onClick={() => setActiveTab(NavTab.SHOP)}
          className="px-6 py-3 bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown font-black text-xs uppercase rounded-xl"
        >
          Browse Honey Products
        </button>
      </div>
    );
  }

  if (submittedOrder) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-[#FFF8E7] text-[#D4A017] rounded-full shadow-inner border border-honey-gold/30">
            <CheckCircle2 size={54} />
          </div>
        </div>

        <h2 className="text-3xl font-bold font-heading text-honey-brown dark:text-white">Order Details Compiled!</h2>
        
        <p className="text-xs text-honey-brown/75 dark:text-honey-warm/75 max-w-md mx-auto leading-relaxed">
          Your order has been recorded into our local database. Please proceed to WhatsApp to complete your transaction with our farm clerks!
        </p>

        <div className="p-6 bg-white dark:bg-charcoal border border-honey-brown/10 dark:border-honey-gold/15 rounded-3xl shadow-sm text-left space-y-3 font-sans">
          <div className="flex justify-between items-center border-b border-honey-brown/5 pb-2">
            <span className="text-xs font-bold text-honey-brown/40 uppercase tracking-widest font-mono">Invoice Records</span>
            <span className="text-[10px] font-mono text-[#2E7D32] bg-[#2E7D32]/10 px-2 py-0.5 rounded-full font-bold">READY TO CHAT</span>
          </div>
          <p className="text-sm font-bold text-honey-brown dark:text-honey-gold">Order ID: <span className="font-mono text-base font-extrabold">{submittedOrder.orderId}</span></p>
          
          <div className="border-t border-honey-brown/5 pt-3 text-xs space-y-1 bg-honey-warm/10 p-3 rounded-xl">
            <p><strong>Customer Name:</strong> {submittedOrder.customerName}</p>
            <p><strong>Contact Phone:</strong> {submittedOrder.phone}</p>
            <p><strong>Shipping Location:</strong> {submittedOrder.address}, {submittedOrder.district}, TN - {submittedOrder.pincode}</p>
            <p className="mt-1 border-t border-honey-brown/5 pt-1"><strong>Total Cost:</strong> <span className="font-mono font-bold text-[#4E2F12] text-sm">₹{submittedOrder.totalAmount}</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => {
              const formattedMsg = getWhatsAppCheckoutMessage(submittedOrder.orderId, submittedOrder.items, submittedOrder.totalAmount);
              const link = `https://wa.me/917708510872?text=${encodeURIComponent(formattedMsg)}`;
              window.open(link, '_blank', 'noopener,noreferrer');
            }}
            className="w-full py-4 bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow"
          >
            <MessageCircle size={16} /> Open farm WhatsApp support
          </button>
          
          <button
            onClick={() => setActiveTab(NavTab.SHOP)}
            className="w-full py-4 border border-honey-brown/20 dark:border-honey-gold/20 hover:bg-honey-brown hover:text-white text-honey-brown dark:text-honey-gold font-extrabold text-xs uppercase rounded-xl transition-all"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6"><div className="py-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6 bg-orange-50 md:bg-transparent min-h-screen">
      
      <button
        onClick={() => setActiveTab(NavTab.CART)}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-honey-brown/60 dark:text-honey-warm/60 hover:text-honey-brown"
      >
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: Shipping/Contact details */}
        <div className="lg:col-span-7 bg-amber-50 md:bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl ...">
          <div className="border-b border-honey-brown/5 pb-3">
            <span className="text-[10px] uppercase font-bold text-[#2E7D32] tracking-widest block mb-0.5">Direct Checkout System</span>
            <h3 className="font-heading font-bold text-2xl text-honey-brown dark:text-white">Shipping Details</h3>
            <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60 mt-1 leading-normal">
              No backend processing, login, or online card payment required. Submit your exact delivery contact below to generate your invoice and complete checkout instantly over our direct WhatsApp farm line.
            </p>
          </div>

          <form onSubmit={handleWhatsAppCheckoutSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Recipient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Karthikeyan Bala"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">WhatsApp Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9845112233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Full Shipping Street Address *</label>
              <textarea
                required
                rows={3}
                placeholder="Door no, Street name, Area coordinates, Near Landmark location detail"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">District / Town *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none"
                >
                  {tamilNaduDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">State *</label>
                <input
                  type="text"
                  disabled
                  value={state}
                  className="w-full px-3 py-3 bg-honey-brown/5 text-xs rounded-xl border border-honey-brown/10 text-honey-brown/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">PIN Code *</label>
                <input
                  type="text"
                  required
                  placeholder="6-digit PIN"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 mt-2 uppercase bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold rounded-xl disabled:opacity-50 tracking-wider shadow transition-all flex items-center justify-center gap-2 text-xs"
            >
              <MessageCircle size={15} />
              {submitting ? 'Compiling Order Info...' : 'Place WhatsApp Farm Order ➔'}
            </button>
          </form>
        </div>

        {/* COLUMN RIGHT: Cart Items Summary Checklist */}
        <div className="lg:col-span-5 bg-yellow-50 md:bg-white dark:bg-charcoal p-6 rounded-3xl ...">
          <div className="border-b border-honey-brown/5 pb-3">
            <h3 className="font-heading font-bold text-lg text-honey-brown dark:text-white flex items-center gap-1.5">
              <ClipboardList size={18} className="text-honey-gold" /> Order Summary
            </h3>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="flex gap-3 justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-honey-brown/10" />
                  <div>
                    <h4 className="font-bold text-honey-brown dark:text-white line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] text-honey-brown/45 font-mono">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-honey-brown dark:text-honey-gold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-honey-brown/5 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-honey-brown/70 dark:text-honey-warm/75">
              <span>Cart Subtotal:</span>
              <span className="font-mono">₹{cartTotalBeforeCoupon}</span>
            </div>
            {couponCode && (
              <div className="flex justify-between font-bold text-[#2E7D32]">
                <span>Coupon ({couponCode}):</span>
                <span className="font-mono">-₹{cartTotalBeforeCoupon - (cartTotalAfterCoupon - shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between text-honey-brown/70 dark:text-honey-warm/75">
              <span>Delivery Flat Freight:</span>
              <span className="font-mono">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
            </div>
            
            <div className="flex justify-between items-baseline pt-2 border-t border-honey-brown/5 text-sm font-bold text-honey-brown dark:text-white">
              <span>Estimated Invoice Total:</span>
              <span className="text-xl font-black text-honey-gold font-mono">₹{cartTotalAfterCoupon}</span>
            </div>
          </div>

          <div className="p-3 bg-[#FFF8E7] rounded-xl space-y-1 border border-honey-gold/20">
            <span className="text-[10px] text-honey-brown font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} className="text-forest-green" /> Authenticated Purity
            </span>
            <p className="text-[9px] text-honey-brown/65 leading-normal font-sans">
              All honey is slow-cured without chemical heating or high pressure filters. Orders placed are hand-packaged directly at Thirunelveli apiaries.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
