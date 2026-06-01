import React, { useState, useMemo } from 'react';
import { useStore } from '../services/storeContext';
import { Product, NavTab } from '../types';
import { Heart, Search, Grid, List, SlidersHorizontal, ShoppingCart, ArrowUpDown, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopPage: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    addToCart,
    setSelectedProductId,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceSort,
    setPriceSort,
    maxPrice,
    setMaxPrice
  } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;

  // Filter Categories dynamically from current products
  const categoriesList = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [products]);

  // Comprehensive Filter & Sorting Memo
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query Filter
    if (searchQuery.trim() !== '') {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(queryLower) ||
        p.tamilName.includes(searchQuery) ||
        p.category.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower)
      );
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => p.price <= maxPrice);

    // Sorting
    if (priceSort === 'low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (priceSort === 'best-selling') {
      // Raja rani mix and highest rated at top
      result.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.rating - a.rating;
      });
    } else if (priceSort === 'latest') {
      // Simple reverse database ordering
      result.reverse();
    }

    return result;
  }, [products, searchQuery, selectedCategory, maxPrice, priceSort]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Adjust pagination if page index exceeds bounds
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredProducts, currentPage, totalPages]);

  const handleCardClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    setActiveTab(NavTab.CART);
  };

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-honey-brown/10 dark:border-honey-gold/10 pb-6 mb-8">
        <div>
          <span className="text-xs text-forest-green font-bold uppercase tracking-widest">Village Organic Store</span>
          <h2 className="text-3xl font-extrabold text-honey-brown dark:text-white font-heading mt-1">
            Browse our Honey Harvests
          </h2>
          <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60">
            Current stock sourced from organic reserves and wild bee combs of Tamil Nadu.
          </p>
        </div>

        {/* Desktop Layout Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-1 px-3 py-2 bg-honey-gold/15 text-honey-brown rounded-lg text-xs font-bold"
          >
            <SlidersHorizontal size={14} /> Filter Specs
          </button>

          <div className="hidden sm:flex border border-honey-brown/10 dark:border-honey-gold/20 rounded-lg p-0.5 bg-honey-warm/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-honey-brown text-white' : 'text-honey-brown/60 hover:text-honey-brown'}`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-honey-brown text-white' : 'text-honey-brown/60 hover:text-honey-brown'}`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Dynamic Sidebar Control Filters */}
        <aside className={`lg:block ${sidebarOpen ? 'block fixed inset-0 z-50 bg-honey-warm/95 dark:bg-charcoal p-6 overflow-y-auto' : 'hidden'} lg:static lg:bg-transparent lg:p-0`}>
          {sidebarOpen && (
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h3 className="font-heading font-black text-honey-brown dark:text-honey-gold text-lg">Filter Preferences</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-2 border border-honey-brown/10 rounded-full text-honey-brown font-bold">X Close</button>
            </div>
          )}

          <div className="space-y-6">
            
            {/* Custom Category Selection list */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-honey-brown dark:text-honey-gold mb-3">
                Categories
              </h4>
              <div className="flex flex-col gap-1.5">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSidebarOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-honey-gold text-honey-brown font-extrabold shadow-sm'
                        : 'text-honey-brown/80 dark:text-honey-warm/80 hover:bg-honey-gold/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Slider filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-honey-brown dark:text-honey-gold">
                  Max Price Range
                </h4>
                <span className="text-xs text-honey-gold font-extrabold font-mono">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="300"
                max="600"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-honey-brown/10 accent-honey-gold rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-honey-brown/50 dark:text-honey-warm/50 font-bold mt-1.5">
                <span>₹300</span>
                <span>₹600</span>
              </div>
            </div>

            {/* Sorting trigger widget */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-honey-brown dark:text-honey-gold mb-3">
                Sort Options
              </h4>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full bg-white dark:bg-charcoal p-2.5 rounded-lg border border-honey-brown/15 dark:border-honey-gold/25 text-xs text-honey-brown dark:text-honey-warm focus:outline-none"
              >
                <option value="none">Standard Sequence</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="best-selling">Top Selling & Rating</option>
                <option value="latest">Latest Arrivals</option>
              </select>
            </div>

            {/* Farm Trust Info Block */}
            <div className="border border-forest-green/20 bg-forest-green/5 p-4 rounded-xl space-y-2">
              <h5 className="text-[11px] font-black uppercase text-forest-green flex items-center gap-1">
                <ShieldCheck size={14} /> Traditional Promise
              </h5>
              <p className="text-[10px] text-honey-brown/70 dark:text-honey-warm/70 leading-relaxed font-sans">
                Our raw honey is extracted under strict hygiene metrics from traditional combs in Tirunelveli and adjoining Western Ghat forests. Fully authentic!
              </p>
            </div>

          </div>
        </aside>

        {/* Product Catalog Display Grid/List */}
        <div className="lg:col-span-3">
          
          {/* Quick Active metrics bar */}
          <div className="flex justify-between items-center text-xs text-honey-brown/60 dark:text-honey-warm/60 mb-4 font-semibold">
            <span>Found {filteredProducts.length} delicious products</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-charcoal rounded-2xl border border-honey-brown/5 shadow-inner">
              <span className="text-4xl mb-3">👀</span>
              <h3 className="font-heading font-black text-lg text-honey-brown">No honey found</h3>
              <p className="text-xs text-honey-brown/60 mt-1 max-w-sm">No items match your selected filters. Try broadening your price bounds or searching for other keywords.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setMaxPrice(600);
                  setPriceSort('none');
                }}
                className="mt-4 px-4 py-2 bg-honey-gold text-honey-brown rounded-lg text-xs font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => {
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`relative bg-white dark:bg-charcoal border border-honey-brown/5 dark:border-honey-gold/10 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex ${
                        viewMode === 'grid' ? 'flex-col h-full' : 'flex-col sm:flex-row p-4 gap-4 items-center'
                      }`}
                    >
                      {/* Badge labels */}
                      {product.isBestSeller && (
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-wider bg-forest-green text-white px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                          <CheckCircle size={10} /> Best Seller
                        </span>
                      )}

                      {/* Cover Photo */}
                      <div 
                        onClick={() => handleCardClick(product.id)}
                        className={`cursor-pointer overflow-hidden relative group/img ${
                          viewMode === 'grid' ? 'w-full aspect-square' : 'w-full sm:w-44 h-44 aspect-square rounded-xl'
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/5" />
                      </div>

                      {/* Details block */}
                      <div className={`p-5 flex flex-col justify-between ${viewMode === 'grid' ? 'flex-grow' : 'flex-grow w-full'}`}>
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-forest-green font-bold uppercase tracking-widest">{product.category}</span>
                          
                          <h3 
                            onClick={() => handleCardClick(product.id)}
                            className="font-heading font-black text-honey-brown dark:text-white text-base hover:text-honey-gold cursor-pointer leading-snug transition-colors line-clamp-1"
                          >
                            {product.name}
                          </h3>
                          
                          <p className="text-[11px] font-bold text-honey-brown/60 dark:text-honey-warm/60 font-sans italic">
                            {product.tamilName}
                          </p>

                          <p className="text-xs text-honey-brown/70 dark:text-honey-warm/70 line-clamp-2 leading-relaxed pt-1 font-sans">
                            {product.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-auto">
                          {/* Price & original rating info */}
                          <div className="flex items-center justify-between border-t border-honey-brown/5 dark:border-honey-gold/5 pt-3 mb-4">
                            <span className="text-xl font-black text-honey-brown dark:text-honey-gold font-mono">
                              ₹{product.price}
                            </span>
                            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-2.5 py-0.5 rounded text-xs font-bold font-mono">
                              ★ <span>{product.rating}</span>
                            </div>
                          </div>

                          {/* Quick Purchase Buttons */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="w-full py-2.5 rounded-xl bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown font-black uppercase tracking-wider hover:bg-honey-gold active:scale-98 transition-all flex items-center justify-center gap-1.5"
                            >
                              <ShoppingCart size={13} /> Add
                            </button>
                            <button
                              onClick={() => handleBuyNow(product)}
                              className="w-full py-2.5 rounded-xl bg-forest-green text-white font-black uppercase tracking-wider hover:bg-emerald-800 active:scale-98 transition-all"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Simple Bootstrap Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-honey-brown/5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-lg border border-honey-brown/10 text-xs font-semibold text-honey-brown dark:text-honey-warm disabled:opacity-40"
              >
                ◀ Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                    currentPage === i + 1
                      ? 'bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown shadow-sm'
                      : 'border border-honey-brown/10 text-honey-brown dark:text-honey-warm hover:bg-honey-gold/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3.5 py-2 rounded-lg border border-honey-brown/10 text-xs font-semibold text-honey-brown dark:text-honey-warm disabled:opacity-40"
              >
                Next ▶
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
