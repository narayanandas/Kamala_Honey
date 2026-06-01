import React, { useState } from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { ShoppingBag, Heart, Search, Menu, X, User, Sun, Moon, Sparkles, LogOut, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    cartCount,
    wishlist,
    currentUser,
    loginAsAdmin,
    loginAsCustomer,
    logout,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const navigationItems = [
    { label: 'Home', tab: NavTab.HOME },
    { label: 'Shop Honey', tab: NavTab.SHOP },
    { label: 'About Farm', tab: NavTab.ABOUT },
    { label: 'Contact Us', tab: NavTab.CONTACT },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 border-b border-honey-brown/10 glass-effect dark:border-honey-gold/15">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick(NavTab.HOME)}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-honey-gold/10 shadow-sm shrink-0 border border-honey-gold/30">
              <img 
                src="https://res.cloudinary.com/dlddzqqnw/image/upload/v1779902931/629709396_18142245394476616_8848105931985901562_n_kkgj74.jpg" 
                alt="Kamala Farm logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-white dark:text-white font-bold text-xl leading-none uppercase tracking-tight italic font-heading">
                Kamala
              </h1>
              <p className="text-[10px] text-white/80 dark:text-white/80 font-bold tracking-[0.2em] uppercase font-sans">
                Natural Honey Farm
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`text-sm font-semibold transition-all duration-200 py-1.5 border-b-2 ${
                  activeTab === item.tab
                    ? 'text-white border-white'
                    : 'text-white/60 border-transparent hover:text-white hover:border-white/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Cart Button */}
            <button
              onClick={() => handleNavClick(NavTab.CART)}
              className="relative p-2 text-white hover:text-white/80 transition-colors duration-200"
              title="Shopping list"
            >
              <ShoppingBag size={20} className={activeTab === NavTab.CART ? 'opacity-100' : 'opacity-80'} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest-green text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Profile Account Setup */}
            <div className="relative">
              <button
                onClick={() => {
                  if (currentUser) {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  } else {
                    handleNavClick(NavTab.DASHBOARD);
                  }
                }}
                className={`flex items-center gap-1 p-1.5 rounded-full border transition-all duration-200 border-white/20 hover:border-white/40 text-white bg-white/5 hover:bg-white/10`}
                title={currentUser ? "Admin Session Tools" : "Admin Login Panel"}
              >
                <User size={18} />
                <span className="hidden lg:block text-xs font-semibold px-1">
                  {currentUser ? 'Admin Active' : 'Admin Login'}
                </span>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && currentUser && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white dark:bg-charcoal border border-honey-brown/15 dark:border-honey-gold/15 p-4 shadow-xl z-20"
                    >
                      <div>
                        <div className="border-b border-honey-brown/10 pb-3 mb-3">
                          <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60">Logged in as Administrator</p>
                          <h4 className="text-sm font-bold text-honey-brown dark:text-honey-gold">{currentUser.name}</h4>
                          <p className="text-[11px] text-honey-brown/80 dark:text-honey-warm/70 truncate">{currentUser.email}</p>
                          <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5 bg-forest-green text-white">
                            Session Status: Authorized
                          </span>
                        </div>

                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              handleNavClick(NavTab.ADMIN);
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold text-forest-green bg-forest-green/5 hover:bg-forest-green/10 transition-colors"
                          >
                            🛠️ Admin Control Panel
                          </button>

                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-red-500 hover:bg-red-500/5 transition-colors border-t border-honey-brown/5 mt-2"
                          >
                            <LogOut size={12} /> Sign Out Session
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-white hover:text-white/80 transition-colors duration-200"
              title="Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Sliding Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-honey-brown/10 dark:border-honey-gold/10 bg-honey-warm dark:bg-charcoal px-4 py-4 space-y-2 overflow-hidden"
          >
            {navigationItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
                  activeTab === item.tab
                    ? 'bg-honey-gold text-honey-brown shadow-sm'
                    : 'text-honey-brown hover:bg-honey-gold/10 dark:text-honey-warm dark:hover:bg-honey-gold/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick(NavTab.ADMIN)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-forest-green bg-forest-green/5 border border-forest-green/20 mb-2`}
                >
                  🛠️ Admin Control Dashboard
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-red-500 bg-red-500/5"
                >
                  🚪 Sign Out Admin Session
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick(NavTab.DASHBOARD)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold bg-honey-gold text-honey-brown"
              >
                🔑 Admin Dashboard Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
