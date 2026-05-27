import React, { useState } from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { CreditCard, ArrowLeft, Upload, CheckCircle2, MessageSquare, ShieldCheck, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotalAfterCoupon,
    placeOrder,
    currentUser,
    setActiveTab
  } = useStore();

  // Step state
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Thirunelveli');
  const [state, setState] = useState(currentUser?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');

  // Payment states
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);

  // TAMIL NADU DISTRICT LIST FOR SEAMLESS USER SELECTION
  const tamilNaduDistricts = [
    'Thirunelveli', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 
    'Kanyakumari', 'Tuticorin', 'Tenkasi', 'Virudhunagar', 'Erode', 'Vellore',
    'Thanjavur', 'Kanchipuram', 'Tiruvallur', 'Tiruppur', 'Dindigul', 'Karur'
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      alert('Please fill out all required shipping details.');
      return;
    }
    setStep(2);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Automated WhatsApp Message generator
  const getWhatsAppMessageRaw = (orderId: string, itemsList: any[], totalAmt: number) => {
    const itemsText = itemsList.map(item => `🐝 *${item.name}* (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
    return `*KAMALA NATURAL HONEY FARM - NEW ORDER* 🍯
---------------------------------------------
*Order ID:* ${orderId}
*Customer Name:* ${name}
*WhatsApp Phone:* ${phone}
*Delivery Address:* 
${address}, ${district}, ${state} - ${pincode}

*Products Selected:*
${itemsText}

---------------------------------------------
*Tamil Nadu Flat Shipping Included*
*Total Outstanding:* ₹${totalAmt}
*Payment Mode:* UPI Transfer (kamalahoneyfarm@upi)
---------------------------------------------
_Thank you for supporting our traditional honey farm!_`;
  };

  const executeWhatsAppRedirect = (orderId: string, itemsList: any[], totalAmt: number) => {
    const formattedText = getWhatsAppMessageRaw(orderId, itemsList, totalAmt);
    const link = `https://wa.me/917708510872?text=${encodeURIComponent(formattedText)}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleFinalSubmit = async () => {
    if (!paymentScreenshot) {
      alert('Please select and upload your UPI Payment receipt screenshot text or picture to fulfill transaction.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await placeOrder({
        name,
        phone,
        address,
        district,
        state,
        pincode,
        paymentProof: paymentScreenshot
      });

      setSubmittedOrder(order);
      setSubmitting(false);

      // Trigger automatic WhatsApp redirect after writing order
      executeWhatsAppRedirect(order.orderId, order.items, order.totalAmount);
    } catch (e) {
      console.error(e);
      alert('Payment authorization failed. Resubmit screenshot file.');
      setSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-100 text-forest-green rounded-full shadow-inner animate-pulse">
            <CheckCircle2 size={54} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-honey-brown dark:text-white font-heading">Order Placed Successfully!</h2>
        
        <div className="p-6 bg-white dark:bg-charcoal border border-honey-brown/10 dark:border-honey-gold/15 rounded-2xl shadow-sm text-left space-y-3 font-sans">
          <p className="text-xs font-black text-honey-brown/50 dark:text-honey-warm/50 uppercase tracking-widest">Order ID Metadata</p>
          <p className="text-sm font-bold text-honey-brown dark:text-honey-gold">ID: <span className="font-mono text-base">{submittedOrder.orderId}</span></p>
          <p className="text-xs text-honey-brown/70 dark:text-honey-warm/70">
            A copy of this invoice has been archived in the database catalog. Your order is pending verification by our admin farm clerk in Thirunelveli.
          </p>
          <div className="border-t border-honey-brown/5 pt-3 text-xs space-y-1">
            <p><strong>Customer:</strong> {submittedOrder.customerName}</p>
            <p><strong>Shipping Pin:</strong> {submittedOrder.pincode}</p>
            <p><strong>Total Amount Paid:</strong> ₹{submittedOrder.totalAmount}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => executeWhatsAppRedirect(submittedOrder.orderId, submittedOrder.items, submittedOrder.totalAmount)}
            className="w-full py-3.5 bg-forest-green text-white font-extrabold text-xs uppercase rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Re-send via WhatsApp
          </button>
          <button
            onClick={() => setActiveTab(NavTab.SHOP)}
            className="w-full py-3.5 bg-honey-gold text-honey-brown font-extrabold text-xs uppercase rounded-xl hover:bg-honey-gold/90 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
      
      {step === 2 && (
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-honey-brown/60 dark:text-honey-warm/60 mb-6 hover:text-honey-brown"
        >
          <ArrowLeft size={14} /> Back to shipping details
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: Main Multi-step submission form */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 shadow-sm">
          
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="border-b border-honey-brown/5 pb-3">
                <h3 className="font-heading font-black text-lg text-honey-brown dark:text-white">Shipping Address</h3>
                <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60">Enter the coordinates where your honey items will be delivered</p>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 or 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">Street Address *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Door no, street address, area location coordinates"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-honey-brown dark:text-honey-gold mb-1.5">District / Region *</label>
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
                      className="w-full px-3 py-3 bg-honey-warm/15 text-xs rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                    />
                  </div>
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-4 bg-honey-brown dark:bg-honey-gold text-white dark:text-honey-brown font-extrabold text-xs uppercase tracking-wider rounded-xl hover:shadow shadow-sm"
              >
                Proceed to UPI Payment Options ➔
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-honey-brown/5 pb-3">
                <h3 className="font-heading font-black text-lg text-honey-brown dark:text-white flex items-center gap-1.5">
                  <CreditCard className="text-honey-gold" size={20} /> UPI Payment Authorization
                </h3>
                <p className="text-[11px] text-honey-brown/60 dark:text-honey-warm/60">Follow instructions and scan prompt QR code to pay instantly</p>
              </div>

              {/* QR Block structure with exact specifications */}
              <div className="bg-honey-warm/30 dark:bg-charcoal/50 p-6 rounded-2xl border border-honey-brown/5 flex flex-col sm:flex-row items-center gap-6 justify-center">
                
                {/* Styled Vector QR Placeholder */}
                <div className="bg-white p-4 rounded-xl shadow border-2 border-honey-gold/60 relative group flex flex-col justify-center items-center">
                  <div className="w-40 h-40 flex items-center justify-center text-honey-brown bg-amber-50 rounded border-2 border-dashed border-honey-brown/10">
                    <QrCode size={135} strokeWidth={1} className="text-honey-brown/90" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-honey-brown/50 pt-2 font-mono">kamalahoneyfarm@upi</span>
                </div>

                <div className="space-y-3 text-center sm:text-left">
                  <span className="text-[10px] bg-honey-gold/20 text-honey-brown dark:text-amber-300 font-black uppercase tracking-wider px-2 py-0.5 rounded">QR Verification Ready</span>
                  <p className="text-sm font-bold text-honey-brown dark:text-white">Amount Outstanding: <span className="text-xl font-black font-mono">₹{cartTotalAfterCoupon}</span></p>
                  
                  <div className="space-y-1.5 text-xs text-honey-brown/80 dark:text-honey-warm/80 leading-normal">
                    <p><strong>Official UPI ID:</strong> <span className="font-mono bg-white dark:bg-charcoal/90 px-1 py-0.5 border border-amber-200 text-honey-brown select-all font-semibold">kamalahoneyfarm@upi</span></p>
                    <p className="text-[10px] italic">1. Scan QR using GPay, PhonePe, Paytm, or BHIM.</p>
                    <p className="text-[10px] italic">2. After payment success, select and upload the transaction screenshot below.</p>
                  </div>
                </div>

              </div>

              {/* Receipt proof screenshot uploader */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-black uppercase tracking-wider text-honey-brown dark:text-honey-gold">Upload Receipt Screenshot File *</label>
                
                <div className="relative border-2 border-dashed border-honey-brown/10 dark:border-honey-gold/20 hover:border-honey-gold/65 rounded-2xl bg-honey-warm/10 hover:bg-honey-warm/25 transition-all p-6 text-center">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <div className="flex flex-col items-center">
                    <Upload size={24} className="text-honey-gold animate-bounce mb-2" />
                    <p className="text-xs font-bold text-honey-brown dark:text-honey-warm">
                      {fileName ? `Selected: ${fileName}` : 'Click here or drop your receipt file'}
                    </p>
                    <p className="text-[10px] text-honey-brown/50 dark:text-honey-warm/40 mt-1 font-mono">PNG, JPG or JPEG allowed</p>
                  </div>
                </div>

                {paymentScreenshot && (
                  <div className="text-xs p-3 bg-emerald-50 text-forest-green font-bold rounded-lg flex items-center gap-2 border border-emerald-200">
                    <span className="text-base">📸</span> Payment screenshot loaded. Click "Place Order" to finalize.
                  </div>
                )}
              </div>

              {/* Submitting CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 text-xs font-black">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleFinalSubmit}
                  className="w-full py-4 uppercase bg-forest-green text-white font-extrabold rounded-xl hover:bg-emerald-800 disabled:opacity-50 tracking-wider shadow"
                >
                  {submitting ? 'Archiving Order details...' : 'Place Order via UPI verification ➔'}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* COLUMN RIGHT: Cart brief checklist summary */}
        <div className="lg:col-span-5 bg-white dark:bg-charcoal p-6 rounded-3xl border border-honey-brown/5 dark:border-honey-gold/10 shadow-sm space-y-4">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider text-honey-brown dark:text-white border-b border-honey-brown/5 pb-3">Checkout Checklist</h3>

          {cart.map((item) => (
            <div key={item.productId} className="flex gap-3 justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <img src={item.image} alt="" className="w-10 h-10 object-cover rounded border border-honey-brown/10" />
                <div>
                  <h4 className="font-bold text-honey-brown dark:text-white line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-honey-brown/40 font-mono">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-honey-brown dark:text-honey-gold">₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t border-honey-brown/5 pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Delivery State:</span>
              <span className="font-bold">Tamil Nadu (Standard)</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-honey-brown dark:text-white">
              <span>Total cost:</span>
              <span className="text-xl font-black text-honey-gold font-mono">₹{cartTotalAfterCoupon}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl space-y-1 mt-4">
            <span className="text-[10px] text-honey-brown font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} className="text-forest-green" /> Purchase Protection
            </span>
            <p className="text-[10px] text-honey-brown/60 leading-normal font-sans">
              All transactions are validated physically inside the apiary backoffice in Tirunelveli. Refunds are credited instantly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
