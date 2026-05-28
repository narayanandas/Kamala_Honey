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
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-honey-gold shadow-sm shrink-0">
              <span className="text-white font-bold text-2xl font-heading">K</span>
            </div>
            <div>
              <h1 className="text-honey-brown dark:text-honey-gold font-bold text-xl leading-none uppercase tracking-tight italic font-heading">
                Kamala
              </h1>
              <p className="text-[10px] text-forest-green dark:text-emerald-405 font-bold tracking-[0.2em] uppercase font-sans">
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
                    ? 'text-honey-brown dark:text-honey-gold border-honey-gold'
                    : 'text-gray-500 border-transparent hover:text-honey-gold hover:border-honey-gold/40 dark:text-honey-warm/75 dark:hover:text-honey-gold'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Icons Panel */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input Toggle */}
            <div className="relative">
              {showSearchBox ? (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== NavTab.SHOP) setActiveTab(NavTab.SHOP);
                    }}
                    placeholder="Search natural honey..."
                    className="w-full px-3 py-1.5 text-xs rounded-full border border-honey-gold bg-honey-warm/95 dark:bg-charcoal dark:text-honey-warm text-honey-brown focus:outline-none focus:ring-1 focus:ring-honey-brown"
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchBox(false);
                    }}
                    className="absolute right-2.5 p-0.5 text-honey-brown/60 dark:text-honey-warm/60 hover:text-honey-brown"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ) : (
                <button
                  onClick={() => setShowSearchBox(true)}
                  className="p-2 text-honey-brown hover:text-honey-gold dark:text-honey-warm dark:hover:text-honey-gold transition-colors duration-200"
                  title="Search products"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Dark & Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-honey-brown hover:text-honey-gold dark:text-honey-warm dark:hover:text-honey-gold transition-colors duration-200"
              title="Toggle theme mode"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick(NavTab.WISHLIST)}
              className="relative p-2 text-honey-brown hover:text-honey-gold dark:text-honey-warm dark:hover:text-honey-gold transition-colors duration-200"
              title="Saved items"
            >
              <Heart size={20} className={activeTab === NavTab.WISHLIST ? 'fill-red-500 text-red-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick(NavTab.CART)}
              className="relative p-2 text-honey-brown hover:text-honey-gold dark:text-honey-warm dark:hover:text-honey-gold transition-colors duration-200"
              title="Shopping list"
            >
              <ShoppingBag size={20} className={activeTab === NavTab.CART ? 'text-honey-gold' : ''} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest-green text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* My Account Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-1 p-1.5 rounded-full border transition-all duration-200 ${
                  currentUser 
                    ? currentUser.role === 'admin'
                      ? 'border-forest-green bg-forest-green/5 text-forest-green'
                      : 'border-honey-gold bg-honey-gold/5 text-honey-gold'
                    : 'border-honey-brown/15 text-honey-brown/75 dark:border-honey-gold/15 dark:text-honey-warm/75'
                }`}
                title="Account Settings"
              >
                <User size={18} />
                <span className="hidden lg:block text-xs font-semibold px-1">
                  {currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'My Account') : 'Sign In'}
                </span>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white dark:bg-charcoal border border-honey-brown/15 dark:border-honey-gold/15 p-4 shadow-xl z-20"
                    >
                      {currentUser ? (
                        <div>
                          <div className="border-b border-honey-brown/10 pb-3 mb-3">
                            <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60">Logged in as</p>
                            <h4 className="text-sm font-bold text-honey-brown dark:text-honey-gold">{currentUser.name}</h4>
                            <p className="text-[11px] text-honey-brown/80 dark:text-honey-warm/70 truncate">{currentUser.email}</p>
                            <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1.5 ${
                              currentUser.role === 'admin'
                                ? 'bg-forest-green text-white'
                                : 'bg-honey-gold text-honey-brown'
                            }`}>
                              Role: {currentUser.role}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {currentUser.role === 'customer' && (
                              <button
                                onClick={() => {
                                  handleNavClick(NavTab.DASHBOARD);
                                  setProfileDropdownOpen(false);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-honey-brown dark:text-honey-warm hover:bg-honey-gold/10 transition-colors"
                              >
                                📋 My Order History
                              </button>
                            )}
                            
                            {currentUser.role === 'admin' ? (
                              <button
                                onClick={() => {
                                  handleNavClick(NavTab.ADMIN);
                                  setProfileDropdownOpen(false);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded text-xs font-semibold text-forest-green bg-forest-green/5 hover:bg-forest-green/10 transition-colors"
                              >
                                🛠️ Admin Control Panel
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  loginAsAdmin();
                                  setProfileDropdownOpen(false);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-honey-brown/70 dark:text-honey-warm/70 hover:bg-honey-gold/10 hover:text-honey-brown transition-colors"
                              >
                                ⚙️ Switch to Admin View
                              </button>
                            )}

                            {currentUser.role === 'admin' && (
                              <button
                                onClick={() => {
                                  loginAsCustomer();
                                  setProfileDropdownOpen(false);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-honey-brown hover:bg-honey-gold/10 transition-colors"
                              >
                                🧑 Go Back to Customer View
                              </button>
                            )}

                            <button
                              onClick={() => {
                                logout();
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full text-left flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-red-500 hover:bg-red-500/5 transition-colors border-t border-honey-brown/5 mt-2"
                            >
                              <LogOut size={12} /> Sign Out Profile
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 py-1">
                          <p className="text-xs text-honey-brown/70 dark:text-honey-warm/70">
                            Connect your profile to track home deliveries from Thirunelveli.
                          </p>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                loginAsCustomer();
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full py-2 rounded-lg bg-honey-gold text-honey-brown hover:bg-honey-gold/90 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                            >
                              Connect Demo Customer
                            </button>
                            <button
                              onClick={() => {
                                loginAsAdmin();
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full py-2 rounded-lg bg-forest-green text-white hover:bg-forest-green-dark text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                            >
                              <Sparkles size={12} /> Access Admin View
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-honey-brown dark:text-honey-warm hover:text-honey-gold transition-colors duration-200"
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
            
            {currentUser && currentUser.role === 'customer' && (
              <button
                onClick={() => handleNavClick(NavTab.DASHBOARD)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === NavTab.DASHBOARD
                    ? 'bg-honey-gold text-honey-brown shadow-sm'
                    : 'text-honey-brown hover:bg-honey-gold/10 dark:text-honey-warm'
                }`}
              >
                📋 My Orders History
              </button>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => handleNavClick(NavTab.ADMIN)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-forest-green bg-forest-green/5 border border-forest-green/20`}
              >
                🛠️ Admin Control Dashboard
              </button>
            )}

            {/* Quick swap button inside mobile menu */}
            <div className="pt-2 border-t border-honey-brown/10 mt-3 flex justify-between items-center text-xs">
              <span className="text-honey-brown/50 dark:text-honey-warm/50 font-semibold">Switch Roles:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { loginAsCustomer(); setMobileMenuOpen(false); }}
                  className="px-2 py-1 bg-honey-gold/20 text-honey-brown rounded text-[10px] font-bold"
                >
                  Customer User
                </button>
                <button
                  onClick={() => { loginAsAdmin(); setMobileMenuOpen(false); }}
                  className="px-2 py-1 bg-forest-green/20 text-forest-green rounded text-[10px] font-bold"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
