import React from 'react';
import { StoreProvider, useStore } from './services/storeContext';
import { NavTab, Product } from './types';
import { Header } from './components/Header';
import { FlyingBees } from './components/FlyingBees';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ShopPage } from './components/ShopPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { MyAccountPage } from './components/MyAccountPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Mail, Phone, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

// Wrapper component to access useStore hook safely inside StoreProvider
const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, products, setSelectedProductId, addToCart } = useStore();

  // Find best sellers dynamically (or high rated items) for homepage visual density
  const bestSellers = products.filter(p => p.isBestSeller || p.rating >= 4.8).slice(0, 3);

  const renderActiveView = () => {
    switch (activeTab) {
      case NavTab.HOME:
        return (
          <div className="space-y-4">
            <Hero />
            
            {/* BEST SELLERS HIGHLIGHT AREA */}
            <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs text-forest-green font-bold uppercase tracking-widest">Patron Favorites</span>
                <h2 className="text-3xl font-extrabold text-honey-brown dark:text-white font-heading">
                  Best Selling Honey Harvests
                </h2>
                <p className="text-xs text-honey-brown/65 dark:text-honey-warm/65 max-w-xl mx-auto font-sans leading-relaxed">
                  Authentic formulas sourced directly from pristine reserve border beekeeping operations. Slow-cured, gravitational-filtered, pure medicinal wellness.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {bestSellers.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 bg-white dark:bg-charcoal border border-honey-brown/5 rounded-3xl flex flex-col justify-between shadow-sm hover:border-honey-gold/30 hover:shadow transition duration-300 relative group"
                  >
                    
                    {/* Floating top seller badge */}
                    <span className="absolute top-4 left-4 z-10 bg-honey-gold text-honey-brown text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                      Best Seller 🍯
                    </span>

                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-honey-warm/15 border border-honey-brown/5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 duration-700 transition"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-forest-green bg-forest-green/10 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        
                        <div>
                          <h3
                            onClick={() => setSelectedProductId(prod.id)}
                            className="text-base font-black text-honey-brown dark:text-white font-heading hover:underline cursor-pointer"
                          >
                            {prod.name}
                          </h3>
                          <p className="text-xs font-bold text-honey-brown/50 italic">{prod.tamilName}</p>
                        </div>

                        <p className="text-xs text-honey-brown/70 dark:text-honey-warm/70 leading-relaxed font-sans line-clamp-2">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-honey-brown/5 mt-4 flex justify-between items-baseline">
                      <span className="text-lg font-black text-honey-brown dark:text-honey-gold font-mono">
                        ₹{prod.price} <span className="text-[10px] text-honey-brown/40 dark:text-honey-warm/40 font-semibold font-sans">/ jar</span>
                      </span>

                      <button
                        onClick={() => setSelectedProductId(prod.id)}
                        className="text-xs text-honey-brown dark:text-honey-gold font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        Details <ArrowRight size={13} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setActiveTab(NavTab.SHOP)}
                  className="px-6 py-3.5 bg-honey-brown dark:bg-honey-gold dark:text-honey-brown text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
                >
                  Explore Entire Honey Catalog
                </button>
              </div>
            </section>

            <Features />

            {/* FARM STORY FOCUS BANNER */}
            <section className="py-16 px-4 bg-honey-gold/10 dark:bg-charcoal/20 border-t border-honey-brown/5">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="flex justify-center">
                  <span className="p-3.5 bg-honey-gold/20 text-honey-brown rounded-full text-2xl animate-spin">🐝</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-honey-brown dark:text-white font-heading leading-tight">
                  Harvested with profound care near Western Ghats borders
                </h3>
                <p className="text-xs sm:text-sm text-honey-brown/75 dark:text-honey-warm/75 max-w-2xl mx-auto leading-relaxed font-sans">
                  Kamala Natural Honey is completely unheated and unfiltered by high-pressure steam, ensuring that trace enzymes, crucial mineral pollens, and vitamins are preserved inside each container. We harvest ethically, support Thirunelveli growers, and package each batch cleanly at our farm gates.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab(NavTab.ABOUT)}
                    className="px-5 py-3 border border-honey-brown/20 dark:border-honey-gold/20 text-honey-brown dark:text-honey-gold text-xs font-black uppercase rounded-xl hover:bg-honey-brown hover:text-white transition"
                  >
                    Read About Farm Origins
                  </button>
                </div>
              </div>
            </section>

          </div>
        );
      case NavTab.SHOP:
        return <ShopPage />;
      case NavTab.ABOUT:
        return <AboutPage />;
      case NavTab.CONTACT:
        return <ContactPage />;
      case NavTab.CART:
        return <CartPage />;
      case NavTab.CHECKOUT:
        return <CheckoutPage />;
      case NavTab.DASHBOARD:
        return <MyAccountPage />;
      case NavTab.ADMIN:
        return <AdminDashboard />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-honey-warm dark:bg-charcoal/95 transition-all text-charcoal">
      
      {/* Dynamic Header */}
      <Header />

      {/* Primary dynamic view content area */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* PROFESSIONAL THEMED FOOTER */}
      <footer className="bg-honey-brown dark:bg-charcoal text-white/90 border-t-2 border-honey-gold/50 text-xs mt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-dripping">🍯</span>
              <h3 className="font-heading font-black tracking-wide text-sm text-honey-gold uppercase">
                Kamala Natural Honey Farm
              </h3>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed font-sans">
              Founded near botanical reserves of Thirunelveli with a traditional dedication to delivering 105% raw wild forest honey. Sourced responsibly and preserved naturally.
            </p>
            <div className="space-y-2 text-[11px] pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-honey-gold" />
                <span className="text-white/80">Thirunelveli, Tamil Nadu, India.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-honey-gold" />
                <span className="text-white/80 font-bold">WhatsApp / Call: +91 7708510872</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-honey-gold uppercase text-[11px] tracking-wider">Honey Offerings</h4>
            <ul className="space-y-2 text-[11px] text-white/70 font-sans">
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => { setActiveTab(NavTab.SHOP); }}>Raw Wild Honey</li>
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => { setActiveTab(NavTab.SHOP); }}>Theen Nelli (Amla Honey)</li>
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => { setActiveTab(NavTab.SHOP); }}>Theen Inji (Ginger Honey)</li>
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => { setActiveTab(NavTab.SHOP); }}>Organic Ghee & Health Blends</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-honey-gold uppercase text-[11px] tracking-wider">Quick Shortcuts</h4>
            <ul className="space-y-2 text-[11px] text-white/70 font-sans">
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => setActiveTab(NavTab.HOME)}>Home Dashboard</li>
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => setActiveTab(NavTab.SHOP)}>Direct Shop</li>
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => setActiveTab(NavTab.ABOUT)}>Our Story</li>
              <li className="hover:text-honey-gold cursor-pointer transition" onClick={() => setActiveTab(NavTab.CONTACT)}>Contact Support</li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-honey-gold uppercase text-[11px] tracking-wider">Certified Wellness</h4>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Double Tested
              </p>
              <p className="text-[9px] text-white/60 leading-normal font-sans">
                Zero added sugar-syrup dilution, certified for purity standards.
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Legal & Copyright details */}
        <div className="border-t border-white/5 bg-black/25 py-4 text-center text-[10px] text-white/40">
          <p>© {new Date().getFullYear()} Kamala Natural Honey Farm. All Rights Reserved. Sourced & Harvested in Thirunelveli fields.</p>
          <p className="mt-1 font-mono text-[9px] text-white/30 tracking-wider">Ethical Beekeeping & Gravitational Sifting Standards.</p>
        </div>
      </footer>

      {/* Dynamic Detailing Modal Trigger */}
      <ProductDetailModal />

      {/* Global Honey Bee Click Flight effect */}
      <FlyingBees />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
