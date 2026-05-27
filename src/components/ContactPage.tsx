import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // Trigger WhatsApp forwarding for inquiries
    const waText = `*KAMALA HONEY Inquiry Form:*
Name: ${name}
Email: ${email}
Phone: ${phone}
Description of Inquiry:
${message}`;
    
    setSuccess(true);
    setTimeout(() => {
      window.open(`https://wa.me/917708510872?text=${encodeURIComponent(waText)}`, '_blank', 'noreferrer,noopener');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSuccess(false);
    }, 1500);
  };

  return (
    <div className="py-12 bg-white dark:bg-charcoal/30">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">
        
        {/* Title block */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs text-forest-green font-bold uppercase tracking-widest">Connect With Kamala Farm</span>
          <h2 className="text-3xl font-extrabold text-honey-brown dark:text-white font-heading">
            Got Questions? Let's Talk!
          </h2>
          <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60 font-sans">
            Need custom jar sizes for weddings, bulk honey crates, or organic farm tours? Write to us below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN LEFT: Contact Information details */}
          <div className="md:col-span-5 space-y-6">
            
            <div className="bg-honey-warm/15 dark:bg-charcoal/50 p-6 rounded-3xl border border-honey-brown/5 space-y-6">
              <h3 className="font-heading font-black text-sm uppercase text-honey-brown dark:text-honey-gold tracking-widest mb-4">
                Farm Head Office
              </h3>

              <div className="space-y-4 text-xs">
                
                <div className="flex gap-3.5">
                  <div className="p-3 bg-honey-gold/20 text-honey-brown rounded-xl h-fit">
                    <MapPin size={16} />
                  </div>
                  <div className="space-y-1 font-sans">
                    <span className="font-bold text-honey-brown dark:text-white block">Kamala Natural Honey Farm</span>
                    <p className="text-honey-brown/70 dark:text-honey-warm/75 leading-relaxed">
                      Main Gate Road, Thirunelveli Botanical Reserve Borders, Tamil Nadu, India.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="p-3 bg-honey-gold/20 text-honey-brown rounded-xl h-fit">
                    <Phone size={16} />
                  </div>
                  <div className="space-y-1 font-sans">
                    <span className="font-bold text-honey-brown dark:text-white block">Call & WhatsApp Business</span>
                    <p className="text-honey-brown/70 dark:text-honey-warm/75 hover:underline cursor-pointer">
                      +91 77085 10872
                    </p>
                    <p className="text-[10px] text-forest-green font-medium">Available 9:00 AM - 7:00 PM (IST)</p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="p-3 bg-honey-gold/20 text-honey-brown rounded-xl h-fit">
                    <Mail size={16} />
                  </div>
                  <div className="space-y-1 font-sans">
                    <span className="font-bold text-honey-brown dark:text-white block">Electronic Mail Address</span>
                    <p className="text-honey-brown/70 dark:text-honey-warm/75 hover:underline cursor-pointer">
                      inquiry@kamalahoney.com
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick WhatsApp helper info */}
            <div className="p-5 border border-forest-green/20 bg-forest-green/5 rounded-2xl flex items-start gap-3.5">
              <MessageCircle size={20} className="text-forest-green shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-forest-green">Instant WhatsApp Orders</span>
                <p className="text-honey-brown/70 dark:text-honey-warm/70 leading-relaxed font-sans">
                  You can bypass the checkout workflow entirely! Take a screenshot of the products you want, click the WhatsApp button on the header, and send it to us. We will dispatch the jars immediately.
                </p>
              </div>
            </div>

          </div>

          {/* COLUMN RIGHT: Modern Inquiry Submission Form */}
          <div className="md:col-span-7 bg-white dark:bg-charcoal p-6 sm:p-8 rounded-3xl border border-honey-brown/5 shadow-sm">
            <h3 className="font-heading font-black text-sm text-honey-brown dark:text-white uppercase tracking-wider mb-4">
              Send us an Inquiry Message
            </h3>

            {success ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-forest-green rounded-xl space-y-2 text-center text-xs">
                <p className="font-extrabold flex items-center justify-center gap-1">
                  ✓ Message Packed Successfully!
                </p>
                <p className="font-sans">Opening WhatsApp to safely dispatch your contact notes with the farm coordinator...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-honey-brown dark:text-honey-gold mb-1.5 font-bold">Your Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-3 bg-honey-warm/15 rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                    />
                  </div>

                  <div>
                    <label className="block text-honey-brown dark:text-honey-gold mb-1.5 font-bold">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-3 bg-honey-warm/15 rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-honey-brown dark:text-honey-gold mb-1.5 font-bold">WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="10 digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                  />
                </div>

                <div>
                  <label className="block text-honey-brown dark:text-honey-gold mb-1.5 font-bold">Message Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your requirement (e.g. wholesale raw forest honey, farm tour reservation schedule...)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-3 bg-honey-warm/15 rounded-xl border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none focus:ring-1 focus:ring-honey-brown"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-honey-brown dark:bg-honey-gold text-white dark:text-honey-brown font-black uppercase text-xs tracking-wider rounded-xl hover:shadow duration-350 flex items-center justify-center gap-1.5"
                >
                  <Send size={13} /> Forward Inquiry (WhatsApp)
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
