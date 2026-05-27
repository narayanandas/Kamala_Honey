import React from 'react';
import { useStore } from '../services/storeContext';
import { NavTab } from '../types';
import { ShoppingCart, Trash2, Heart, ExternalLink } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    setSelectedProductId,
    setActiveTab
  } = useStore();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-12 bg-white dark:bg-charcoal/30 min-h-[60vh]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
        
        {/* Title block */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 border-b border-honey-brown/10 dark:border-honey-gold/10 pb-4">
          <div>
            <span className="text-xs text-forest-green font-bold uppercase tracking-widest">Saved Collections</span>
            <h2 className="text-3xl font-extrabold text-honey-brown dark:text-white font-heading mt-0.5">
              My Whislist Cart
            </h2>
          </div>
          <button
            onClick={() => setActiveTab(NavTab.SHOP)}
            className="text-xs text-honey-brown dark:text-honey-gold font-bold uppercase hover:underline"
          >
            ← Browse more honey selections
          </button>
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 bg-honey-gold/10 rounded-full h-16 w-16 mx-auto flex items-center justify-center text-honey-brown">
              <Heart size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-honey-brown dark:text-white">Your wishlist collection is empty</h3>
              <p className="text-xs text-honey-brown/60 dark:text-honey-warm/60 leading-normal font-sans py-2">
                Click the heart icon on any honey jar item in our store to save it here for fast access.
              </p>
            </div>
            <button
              onClick={() => setActiveTab(NavTab.SHOP)}
              className="px-6 py-3 bg-honey-brown text-white dark:bg-honey-gold dark:text-honey-brown font-black text-xs uppercase rounded-xl"
            >
              Explore Honey Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-honey-warm/15 dark:bg-charcoal p-4 rounded-3xl border border-honey-brown/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-honey-brown/5 shadow-inner">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full hover:bg-red-50"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-forest-green bg-forest-green/10 px-2 py-0.5 rounded-full inline-block">
                      {p.category}
                    </span>
                    <h3
                      onClick={() => setSelectedProductId(p.id)}
                      className="text-sm font-black text-honey-brown dark:text-white line-clamp-1 hover:underline hover:text-honey-gold cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-honey-brown/65 dark:text-honey-warm/65 font-sans min-h-[30px] line-clamp-2">
                      {p.description}
                    </p>
                    <span className="text-sm font-black text-honey-brown dark:text-honey-gold font-mono block pt-1">
                      ₹{p.price}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => {
                      addToCart(p, 1);
                    }}
                    className="w-full py-2 bg-honey-brown text-white hover:bg-black font-extrabold text-[11px] uppercase rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart size={12} /> Add to Cart
                  </button>
                  <button
                    onClick={() => setSelectedProductId(p.id)}
                    className="w-full py-2 hover:bg-honey-gold/10 text-honey-brown dark:text-honey-gold font-extrabold text-[10px] uppercase rounded-xl flex items-center justify-center gap-1 border border-honey-brown/10"
                  >
                    Full Details <ExternalLink size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
