import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../services/storeContext';
import { dbStore } from '../services/dbStore';
import { Product, Review, NavTab } from '../types';
import { Heart, ShoppingCart, MessageSquare, X, Star, Share2, Shield, Apple, Clock, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    setActiveTab
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Find the selected product matching ID
  const product = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // Load reviews when product matches
  useEffect(() => {
    if (product) {
      dbStore.getReviewsForProduct(product.id).then(setReviews);
      setQty(1);
      setActiveImageIdx(0);
      setReviewSuccess(false);
      setReviewerName('');
      setComment('');
      setUserRating(5);
    }
  }, [product]);

  // Gallery images construct (different mock angles of honey jars)
  const images = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      'https://images.unsplash.com/photo-1587049365226-ac434a2c07d5?auto=format&fit=crop&q=80&w=500', // pouring honey
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=500'  // apiary closeup
    ];
  }, [product]);

  if (!product) return null;

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleAddToCartClick = () => {
    addToCart(product, qty);
  };

  const handleBuyNowClick = () => {
    addToCart(product, qty);
    setSelectedProductId(null);
    setActiveTab(NavTab.CART);
  };

  const handleShareClick = () => {
    const textMsg = `Hey! Check out this pure nectary product from Kamala Natural Honey Farm: ${product.name} (Price: ₹${product.price}). Location: Thirunelveli, Tamil Nadu. Order here: wa.me/917708510872`;
    window.open(`https://wa.me/?text=${encodeURIComponent(textMsg)}`, '_blank', 'noreferrer,noopener');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      reviewerName: reviewerName.trim(),
      rating: userRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    await dbStore.addReview(newReview);
    const updatedReviews = await dbStore.getReviewsForProduct(product.id);
    setReviews(updatedReviews);
    setReviewSuccess(true);
    setReviewerName('');
    setComment('');
  };

  // Find related products (same category, excluding active item)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        
        {/* Background Overlay dismiss trigger */}
        <div className="fixed inset-0 cursor-default" onClick={() => setSelectedProductId(null)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative bg-honey-warm dark:bg-charcoal border border-honey-brown/15 dark:border-honey-gold/15 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl z-10"
        >
          {/* Close button icon */}
          <button
            onClick={() => setSelectedProductId(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-white/70 dark:bg-charcoal/80 text-honey-brown hover:text-red-500 rounded-full transition-all border border-honey-brown/10 shadow-sm"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
            
            {/* COLUMN LEFT: Visual carousel zoom and thumbnails */}
            <div className="md:col-span-6 p-6 space-y-4 border-r border-honey-brown/10 dark:border-honey-gold/10">
              
              {/* Zoomable Container View */}
              <div 
                className="w-full aspect-square rounded-2xl overflow-hidden bg-white relative border border-honey-brown/10 shadow-inner group"
                onMouseMove={handleZoom}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={images[activeImageIdx]}
                  alt={product.name}
                  style={isZoomed ? { ...zoomStyle, transform: 'scale(1.8)' } : {}}
                  className="w-full h-full object-cover transition-transform duration-200 cursor-zoom-in"
                  referrerPolicy="no-referrer"
                />
                
                <span className="absolute bottom-3 left-3 bg-black/60 text-white rounded px-2.5 py-0.5 text-[9px] font-semibold flex items-center gap-1">
                  <span>Zoom Feature Active: Move mouse over jar</span>
                </span>
              </div>

              {/* Multiple Thumbnails selection row */}
              <div className="flex gap-2">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIdx(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white transition-all ${
                      activeImageIdx === index 
                        ? 'border-honey-gold scale-102' 
                        : 'border-honey-brown/10 dark:border-honey-gold/10 hover:border-honey-gold/50'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </button>
                ))}
              </div>

              {/* Certifications assurances */}
              <div className="pt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-white/50 dark:bg-charcoal/30 rounded-xl border border-honey-brown/5 flex flex-col items-center">
                  <Shield size={16} className="text-forest-green mb-1" />
                  <span className="text-[10px] font-bold text-honey-brown dark:text-honey-gold">Lab Tested</span>
                </div>
                <div className="p-3 bg-white/50 dark:bg-charcoal/30 rounded-xl border border-honey-brown/5 flex flex-col items-center">
                  <Apple size={16} className="text-forest-green mb-1" />
                  <span className="text-[10px] font-bold text-honey-brown dark:text-honey-gold">100% Organic</span>
                </div>
                <div className="p-3 bg-white/50 dark:bg-charcoal/30 rounded-xl border border-honey-brown/5 flex flex-col items-center">
                  <Clock size={16} className="text-forest-green mb-1" />
                  <span className="text-[10px] font-bold text-honey-brown dark:text-honey-gold">Traditional</span>
                </div>
              </div>

              {/* Related/Similar Items recommendation */}
              {related.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-xs font-black uppercase text-honey-brown dark:text-honey-gold mb-3">Similar Infusions</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {related.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        className="p-1.5 rounded-lg border border-honey-brown/5 dark:border-honey-gold/10 bg-white dark:bg-charcoal/60 hover:bg-honey-gold/5 cursor-pointer text-center space-y-1 transition duration-250"
                      >
                        <img 
                          src={p.image} 
                          alt="" 
                          className="w-14 h-14 object-cover mx-auto rounded-md shadow-sm" 
                          referrerPolicy="no-referrer" 
                        />
                        <h5 className="text-[10px] font-bold text-honey-brown dark:text-white truncate">{p.name}</h5>
                        <p className="text-[10px] font-mono text-honey-gold font-bold">₹{p.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* COLUMN RIGHT: Details, description, reviews, review forms */}
            <div className="md:col-span-6 p-6 space-y-6">
              
              <div className="space-y-2 border-b border-honey-brown/10 dark:border-honey-gold/10 pb-4">
                <span className="text-[11px] text-forest-green font-bold uppercase tracking-wider">{product.category}</span>
                
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-black text-honey-brown dark:text-white font-heading leading-tight">
                    {product.name}
                  </h2>
                </div>
                
                <p className="text-sm font-semibold italic text-honey-brown/70 dark:text-honey-warm/70">
                  {product.tamilName}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1 text-amber-500">
                    ★ <span className="font-bold text-honey-brown dark:text-honey-gold">{product.rating}</span>
                  </div>
                  <span className="text-honey-brown/40">|</span>
                  <span className="text-forest-green font-extrabold">✓ Farm Verified Stock</span>
                  <span className="text-honey-brown/40">|</span>
                  <span className={`text-[11px] font-semibold ${product.inventory > 10 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.inventory > 10 ? `In Stock (${product.inventory} jars left)` : `Low Stock! (${product.inventory} jars left)`}
                  </span>
                </div>
              </div>

              {/* Price details & Description */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-honey-brown dark:text-honey-gold font-mono">₹{product.price}</span>
                  <span className="text-xs text-honey-brown/50 dark:text-honey-warm/50 font-semibold">(Inclusive of all local Tamil Nadu taxes)</span>
                </div>
                
                <p className="text-xs text-honey-brown/85 dark:text-honey-warm/85 leading-relaxed font-sans">
                  {product.description}
                </p>

                {/* Botanical Ingredients check checklist */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 space-y-1.5">
                    <span className="text-[10px] text-honey-brown font-black uppercase tracking-wider flex items-center gap-1">
                      <Layers size={13} /> Pure Ingredients Formula
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {product.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-white dark:bg-charcoal border border-honey-brown/5 text-honey-brown/85 dark:text-honey-warm/85 px-2.5 py-1 rounded">
                          🌾 {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity selectors & CTAs */}
              <div className="space-y-4 pt-4 border-t border-honey-brown/10">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black uppercase text-honey-brown dark:text-honey-gold">Quantity:</span>
                  
                  <div className="flex items-center border border-honey-brown/20 dark:border-honey-gold/30 rounded-xl overflow-hidden bg-white dark:bg-charcoal shadow-sm">
                    <button
                      onClick={() => setQty(prev => Math.max(1, prev - 1))}
                      className="px-3.5 py-2 hover:bg-honey-gold/10 font-black text-honey-brown dark:text-honey-warm"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-mono text-sm font-bold text-honey-brown dark:text-honey-warm">
                      {qty}
                    </span>
                    <button
                      disabled={qty >= product.inventory}
                      onClick={() => setQty(prev => Math.min(product.inventory, prev + 1))}
                      className="px-3.5 py-2 hover:bg-honey-gold/10 font-bold text-honey-brown dark:text-honey-warm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <button
                    onClick={handleAddToCartClick}
                    className="py-3 px-6 rounded-xl bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown font-black uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={15} /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNowClick}
                    className="py-3 px-6 rounded-xl bg-forest-green text-white font-black uppercase tracking-wider hover:bg-emerald-900 transition-all"
                  >
                    Buy Now 🚀
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleShareClick}
                    className="w-full py-2 border border-honey-brown/15 dark:border-honey-gold/25 text-xs text-honey-brown dark:text-honey-warm rounded-lg hover:bg-honey-gold/10 transition-colors flex items-center justify-center gap-1.5 font-bold"
                  >
                    <Share2 size={13} /> Share with Friends (WhatsApp)
                  </button>
                </div>
              </div>

              {/* Reviews and Ratings container */}
              <div className="space-y-4 pt-6 border-t border-honey-brown/10">
                <h3 className="text-sm font-black uppercase tracking-widest text-honey-brown dark:text-honey-gold">
                  Customer Experiences ({reviews.length})
                </h3>

                {/* Display existing reviews */}
                <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-honey-brown/50 dark:text-honey-warm/50 italic py-2">No product reviews yet. Be the first to express opinion!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-white/40 dark:bg-charcoal/40 rounded-xl border border-honey-brown/5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-honey-brown dark:text-honey-gold">{rev.reviewerName}</span>
                          <div className="flex gap-0.5 text-xs font-mono text-amber-500 font-bold">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </div>
                        </div>
                        <p className="text-xs text-honey-brown/80 dark:text-honey-warm/80 leading-relaxed pt-1.5 font-sans">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Create/Submit Review Form */}
                <form onSubmit={handleSubmitReview} className="space-y-3 bg-white dark:bg-charcoal/60 p-4 rounded-xl border border-honey-brown/5">
                  <span className="text-xs font-black uppercase text-honey-brown dark:text-honey-gold block">Post Your Verified Review</span>
                  
                  {reviewSuccess ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                      Thank you! Your feedback has been synchronized with the farm records.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="px-2.5 py-1.5 bg-honey-warm/25 dark:bg-charcoal/80 text-xs rounded border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none"
                        />
                        <select
                          value={userRating}
                          onChange={(e) => setUserRating(parseInt(e.target.value))}
                          className="px-2.5 py-1.5 bg-honey-warm/25 dark:bg-charcoal/80 text-xs rounded border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none text-amber-500 font-bold"
                        >
                          <option value="5">★★★★★ Excellent (5)</option>
                          <option value="4">★★★★☆ Good (4)</option>
                          <option value="3">★★★☆☆ Average (3)</option>
                          <option value="2">★★☆☆☆ Poor (2)</option>
                          <option value="1">★☆☆☆☆ Terrible (1)</option>
                        </select>
                      </div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Write comments about your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-honey-warm/25 dark:bg-charcoal/80 text-xs rounded border border-honey-brown/10 dark:border-honey-gold/15 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-honey-gold text-honey-brown font-black uppercase text-[10px] tracking-widest rounded hover:bg-honey-brown hover:text-white transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </form>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
