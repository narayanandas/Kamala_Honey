import React from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { Search, ShoppingCart, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-honey-gold/10 via-honey-warm to-honey-warm/50 py-12 md:py-20 lg:py-28 dark:from-charcoal dark:via-charcoal dark:to-charcoal/90">
      
      {/* Decorative Golden Nectar SVG Overlays representing traditional village theme */}
      <div className="absolute top-0 right-0 left-0 h-10 pointer-events-none opacity-20 dark:opacity-40 animate-dripping">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-honey-gold fill-current">
          <path d="M0,0 L1440,0 L1440,40 C1400,60 1350,20 1300,50 C1250,80 1200,30 1150,60 C1100,90 1050,40 1000,70 C950,100 900,50 850,75 C800,100 750,40 700,80 C650,120 600,60 550,90 C500,120 450,40 400,70 C350,100 300,50 250,75 C200,100 150,40 100,80 C50,120 0,60 0,60 Z" />
        </svg>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copywriting Area */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#D4A017]/10 text-[#4E2F12] px-3 py-1 rounded-full w-max dark:bg-[#D4A017]/15 dark:text-honey-gold"
            >
              <span className="w-2 h-2 bg-[#D4A017] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold tracking-wider uppercase">From Thirunelveli, Tamil Nadu</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#4E2F12] dark:text-white font-heading leading-tight"
            >
              100% Pure Natural <br /><span className="text-[#D4A017]">Honey Products</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-700 dark:text-honey-warm/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Traditional honey infused health products made with love and purity. Discover our authentic Tamil Nadu village formulas, cured patiently for high medicinal value and organic flavors.
            </motion.p>

            {/* CTA Option Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={() => setActiveTab(NavTab.SHOP)}
                className="w-full sm:w-auto bg-[#4E2F12] text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-[#4E2F12]/20 hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase"
              >
                <ShoppingCart size={18} />
                <span>Shop Honey Now</span>
              </button>

              <a
                href="https://wa.me/917708510872"
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="w-full sm:w-auto border-2 border-[#2E7D32] text-[#2E7D32] bg-transparent hover:bg-[#2E7D32] hover:text-white px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase"
              >
                <MessageSquare size={18} />
                <span>WhatsApp Order</span>
              </a>
            </motion.div>

            {/* Quick Micro trust elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-honey-brown/10 dark:border-honey-gold/15"
            >
              <div>
                <span className="block text-2xl font-extrabold text-honey-brown dark:text-honey-gold font-heading">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-honey-brown/60 dark:text-honey-warm/50 font-bold">Raw & Natural</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-honey-brown dark:text-honey-gold font-heading">No</span>
                <span className="text-[10px] uppercase tracking-wider text-honey-brown/60 dark:text-honey-warm/50 font-bold">Preservatives</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-honey-brown dark:text-honey-gold font-heading">Local</span>
                <span className="text-[10px] uppercase tracking-wider text-honey-brown/60 dark:text-honey-warm/50 font-bold">Farmers Nectar</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Parallax / Floating Image Display */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-[320px] h-[400px] bg-honey-gold/20 rounded-t-[160px] rounded-b-2xl overflow-hidden border-4 border-white shadow-2xl group shrink-0"
            >
              <img
                src="https://res.cloudinary.com/dlddzqqnw/image/upload/v1779905674/Gemini_Generated_Image_arcgdxarcgdxarcg_xmvn7x.png"                alt="Kamala Natural Honey Farm Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-honey-brown/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Featured Fresh Product</p>
                  <h3 className="text-lg font-black text-white font-heading">Theen Nelli (தேன் நெல்லி)</h3>
                  <p className="text-white/80 text-xs">Rich whole gooseberries slow-preserved in original wildwoods nectar.</p>
                </div>
              </div>
            </motion.div>

            {/* Floating elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-[#2E7D32]/15 rounded-full border border-[#2E7D32]/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
               <span className="text-[#2E7D32] text-[10px] font-black text-center leading-tight uppercase">100%<br/>Natural</span>
            </div>

            {/* Glowing Accent Ring Behind Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[420px] h-80 sm:h-[420px] rounded-full bg-honey-gold/10 blur-3xl -z-10 animate-pulse" />
          </div>

        </div>
      </div>
    </section>
  );
};
