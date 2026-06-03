import React, { useState, useEffect } from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { ShieldCheck, ArrowLeft, Send, CheckCircle2, MessageCircle, MapPin, ClipboardList, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  
  // Payment Option selection State
  const [paymentOption, setPaymentOption] = useState<'whatsapp' | 'razorpay'>('whatsapp');

  // Load Razorpay Checkout SDK script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        paymentProof: 'WhatsApp Direct Fulfill', // Set explicit indicator that no raw billing block is required
        paymentMethod: 'WhatsApp Direct',
        paymentStatus: 'Unpaid'
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

  const handleRazorpayCheckoutSubmit = async (e: React.FormEvent) => {
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

    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay Checkout SDK is still loading. Please wait a brief moment and tap pay again.');
      setSubmitting(false);
      return;
    }

    // Determine configured API keys or fall back to standard Razorpay Sandbox Key format
    const rzpKeyId = ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID) || 'rzp_test_SxI0QKdXcW4ccd';

    const options = {
      key: rzpKeyId,
      amount: cartTotalAfterCoupon * 100, // Amount expected in Paisa by Razorpay API
      currency: 'INR',
      name: 'Kamala Natural Honey Farm',
      description: `Purchase of Premium Honey Products`,
      image: 'https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=150',
      handler: async function (response: any) {
        try {
          // Log paid order on Firestore Real DB connection
          const order = await placeOrder({
            name,
            phone,
            address,
            district,
            state,
            pincode,
            paymentProof: `Paid securely with Razorpay: TXN ${response.razorpay_payment_id}`,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid',
            paymentId: response.razorpay_payment_id
          });
          setSubmittedOrder(order);
        } catch (err) {
          console.error('Error logging order details upon payment confirmation:', err);
          alert(`Your payment ID ${response.razorpay_payment_id} was successfully processed, but we had trouble completing the database record. Please message WhatsApp support immediately!`);
        } finally {
          setSubmitting(false);
        }
      },
      prefill: {
        name: name,
        contact: phone,
        email: currentUser?.email || 'customer@kamalahoney.com'
      },
      theme: {
        color: '#D4A017' // Premium brand honey gold hex
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false);
        }
      }
    };

    try {
      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error(err);
      alert('Payment creation failed. Try switching back to manual WhatsApp invoicing.');
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
    const isRazorpayOrder = submittedOrder.paymentMethod === 'Razorpay';

    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-[#2E7D32] rounded-full shadow-inner border border-emerald-500/20">
            <CheckCircle2 size={54} />
          </div>
        </div>

        <h2 className="text-3xl font-bold font-heading text-honey-brown dark:text-white">
          {isRazorpayOrder ? 'Order Paid & Placed!' : 'Order Details Compiled!'}
        </h2>
        
        <p className="text-xs text-honey-brown/75 dark:text-honey-warm/75 max-w-md mx-auto leading-relaxed">
          {isRazorpayOrder 
            ? 'Your payment was successfully compiled and saved in our cloud database! Deliveries are packaged at Thirunelveli fields within 24 hours.' 
            : 'Your order has been recorded into our database. Please proceed to WhatsApp to complete your transaction with our farm clerks!'}
        </p>

        <div className="p-6 bg-white dark:bg-charcoal border border-honey-brown/10 dark:border-honey-gold/15 rounded-3xl shadow-sm text-left space-y-3 font-sans">
          <div className="flex justify-between items-center border-b border-honey-brown/5 pb-2">
            <span className="text-xs font-bold text-honey-brown/40 uppercase tracking-widest font-mono">Invoice Records</span>
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
              isRazorpayOrder ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#D4A017]/10 text-[#D4A017]'
            }`}>
              {isRazorpayOrder ? 'PAID & CONFIRMED' : 'RESERVED & READY'}
            </span>
          </div>

          <p className="text-sm font-bold text-honey-brown dark:text-honey-gold">
            Order ID: <span className="font-mono text-base font-extrabold">{submittedOrder.orderId}</span>
          </p>
          
          <div className="border-t border-honey-brown/5 pt-3 text-xs space-y-1 bg-honey-warm/10 p-3 rounded-xl dark:bg-charcoal/40">
            <p><strong>Customer Name:</strong> {submittedOrder.customerName}</p>
            <p><strong>Contact Phone:</strong> {submittedOrder.phone}</p>
            <p><strong>Shipping Location:</strong> {submittedOrder.address}, {submittedOrder.district}, TN - {submittedOrder.pincode}</p>
            <p><strong>Payment Method:</strong> {submittedOrder.paymentMethod}</p>
            {isRazorpayOrder && <p><strong>Razorpay Payment ID:</strong> <span className="font-mono text-[11px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-bold">{submittedOrder.paymentId}</span></p>}
            <p className="mt-1 border-t border-honey-brown/5 pt-1"><strong>Total Cost:</strong> <span className="font-mono font-bold text-[#4E2F12] dark:text-honey-gold text-sm">₹{submittedOrder.totalAmount}</span></p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => {
              const baseMsg = isRazorpayOrder 
                ? `*KAMALA NATURAL HONEY FARM - PAID ORDER CONFIRMED* 🍯\n---------------------------------------------\n*Order ID:* ${submittedOrder.orderId}\n*Razorpay Payment ID:* ${submittedOrder.paymentId}\n*Amount:* ₹${submittedOrder.totalAmount}\n\nHi Kamala Farm support, my order is paid via App card/UPI checkout! Please rush my dispatch schedule.`
                : getWhatsAppCheckoutMessage(submittedOrder.orderId, submittedOrder.items, submittedOrder.totalAmount);
              const link = `https://wa.me/917708510872?text=${encodeURIComponent(baseMsg)}`;
              window.open(link, '_blank', 'noopener,noreferrer');
            }}
            className="w-full py-4 bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow"
          >
            <MessageCircle size={16} /> Open farm WhatsApp support
          </button>
          
          <button
            onClick={() => setActiveTab(NavTab.SHOP)}
            className="w-full py-4 border border-honey-brown/20 dark:border-honey-gold/20 hover:bg-honey-brown hover:text-white dark:hover:bg-honey-gold dark:hover:text-honey-brown text-honey-brown dark:text-honey-gold font-extrabold text-xs uppercase rounded-xl transition-all"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
      
      <button
        onClick={() => setActiveTab(NavTab.CART)}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-honey-brown/60 dark:text-honey-warm/60 hover:text-honey-brown"
      >
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: Shipping/Contact details */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 shadow-sm space-y-6">
          <div className="border-b border-honey-brown/5 pb-3">
            <span className="text-[10px] uppercase font-bold text-[#d49917] tracking-widest block mb-0.5">Secure Gateway Integration</span>
            <h3 className="font-heading font-bold text-2xl text-honey-brown dark:text-white">Shipping & Billing</h3>
            <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60 mt-1 leading-normal">
              Enter details below and choose your preferred transaction method to confirm shipment instantly.
            </p>
          </div>

          {/* PAYMENT OPTION TAB SELECTOR */}
          <div className="p-1.5 bg-honey-warm/25 dark:bg-charcoal/80 border border-honey-brown/10 rounded-2xl grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPaymentOption('whatsapp')}
              className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                paymentOption === 'whatsapp'
                  ? 'bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown shadow-sm'
                  : 'text-honey-brown/70 dark:text-honey-warm/60 hover:bg-honey-brown/5 dark:hover:bg-amber-100/5'
              }`}
            >
              <MessageCircle size={15} /> WhatsApp Fulfill
            </button>
            <button
              onClick={() => setPaymentOption('razorpay')}
              className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                paymentOption === 'razorpay'
                  ? 'bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown shadow-sm'
                  : 'text-honey-brown/70 dark:text-honey-warm/60 hover:bg-honey-brown/5 dark:hover:bg-amber-100/5'
              }`}
            >
              <CreditCard size={15} /> Razorpay Pay Online
            </button>
          </div>

          <form 
            onSubmit={paymentOption === 'whatsapp' ? handleWhatsAppCheckoutSubmit : handleRazorpayCheckoutSubmit} 
            className="space-y-4 text-xs font-semibold"
          >
            <div>
              <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Recipient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Karthikeyan Bala"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-3 bg-honey-warm/15 dark:bg-charcoal/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 text-honey-brown dark:text-white focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
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
                className="w-full px-3 py-3 bg-honey-warm/15 dark:bg-charcoal/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 text-honey-brown dark:text-white focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
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
                className="w-full px-3 py-3 bg-honey-warm/15 dark:bg-charcoal/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 text-honey-brown dark:text-white focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">District / Town *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-3 bg-honey-warm/15 dark:bg-charcoal/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 text-honey-brown dark:text-white focus:outline-none"
                >
                  {tamilNaduDistricts.map(d => (
                    <option key={d} value={d} className="dark:bg-charcoal text-honey-brown dark:text-white">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">State *</label>
                <input
                  type="text"
                  disabled
                  value={state}
                  className="w-full px-3 py-3 bg-honey-brown/5 dark:bg-charcoal/20 text-xs rounded-xl border border-honey-brown/10 text-honey-brown/50 dark:text-honey-warm/50 cursor-not-allowed"
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
                  className="w-full px-3 py-3 bg-honey-warm/15 dark:bg-charcoal/40 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 text-honey-brown dark:text-white focus:outline-none focus:ring-1 focus:ring-honey-brown transition"
                />
              </div>
            </div>

            {paymentOption === 'whatsapp' ? (
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 mt-2 uppercase bg-[#2E7D32] hover:bg-emerald-800 text-white font-extrabold rounded-xl disabled:opacity-50 tracking-wider shadow transition-all flex items-center justify-center gap-2 text-xs"
              >
                <MessageCircle size={15} />
                {submitting ? 'Compiling Order Info...' : 'Place WhatsApp Farm Order ➔'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 mt-2 uppercase bg-honey-brown hover:bg-black text-white dark:bg-honey-gold dark:text-honey-brown dark:hover:bg-amber-400 font-extrabold rounded-xl disabled:opacity-50 tracking-wider shadow transition-all flex items-center justify-center gap-2 text-xs"
              >
                <CreditCard size={15} />
                {submitting ? 'Launching Payment Widget...' : `Pay via Razorpay Gateway (₹${cartTotalAfterCoupon}) ➔`}
              </button>
            )}
          </form>
        </div>

        {/* COLUMN RIGHT: Cart Items Summary Checklist */}
        <div className="lg:col-span-5 bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 shadow-sm space-y-4">
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

          <div className="p-3 bg-[#FFF8E7] dark:bg-[#FFF8E7]/5 rounded-xl space-y-1 border border-honey-gold/20">
            <span className="text-[10px] text-honey-brown dark:text-honey-gold font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} className="text-forest-green" /> Authenticated Purity
            </span>
            <p className="text-[9px] text-honey-brown/65 dark:text-honey-warm/65 leading-normal font-sans">
              All honey is slow-cured without chemical heating or high pressure filters. Orders placed are hand-packaged directly at Thirunelveli apiaries.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
