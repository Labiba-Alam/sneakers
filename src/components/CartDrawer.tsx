import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Truck, Crown, Heart, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    setView,
    toggleWishlist,
    showToast
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');
    const res = await applyCoupon(couponCodeInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponSuccess(res.message);
      setCouponCodeInput('');
    }
  };

  const handleMoveToWishlist = (item: any) => {
    toggleWishlist(item.product.id);
    removeFromCart(item.id);
    showToast(`Moved ${item.product.name} to Wishlist.`, 'info');
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
      />

      {/* Cart Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-[#141414] border-l border-white/10 h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-2 text-white">
            <ShoppingBag className="w-5 h-5 text-[#C1121F]" />
            <h3 className="font-serif-luxury text-xl font-bold tracking-wider">Royal Cart</h3>
            <span className="text-xs bg-[#C1121F] text-white font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#1B1B1B] p-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium mb-2">
            <Truck className="w-4 h-4 text-[#C7A55B]" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Complimentary Express Shipping Unlocked!
              </span>
            ) : (
              <span>
                Add <strong className="text-[#C7A55B]">{formatPrice(amountNeededForFreeShipping)}</strong> more for FREE Express Courier Delivery
              </span>
            )}
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C7A55B] to-[#C1121F] h-full transition-all duration-500"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 divide-y divide-white/10">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-16 h-16 text-white/20 mx-auto" />
              <div>
                <p className="font-serif-luxury text-xl text-white font-bold mb-1">Your Shopping Bag is Empty</p>
                <p className="text-xs text-white/50 max-w-xs mx-auto font-light">
                  Explore our handcrafted sneaker collection to add exclusive silhouettes.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setView('catalog');
                }}
                className="px-6 py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-widest transition-all shadow-lg"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map(item => {
              const maxStock = item.product.sizeStock?.[item.selectedSize] ?? item.product.stock;

              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 group">
                  <img
                    src={optimizeImageUrl(item.product.images[0], 200, 75)}
                    alt={`${item.product.name} in ${item.selectedColor.name} (EU ${item.selectedSize}) - Luxury Footwear Item`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 bg-[#1A1A1A] object-contain border border-white/10 p-1 shrink-0 rounded-none"
                  />

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif-luxury text-sm font-bold text-white line-clamp-1 group-hover:text-[#C7A55B] transition-colors">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                          Size: EU {item.selectedSize}
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="text-[11px] text-[#C7A55B] font-medium">
                          {item.selectedColor.name}
                        </span>
                      </div>
                      
                      {maxStock > 0 && maxStock <= 3 && (
                        <p className="text-[10px] text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Only {maxStock} left in stock for size {item.selectedSize}!
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/20 bg-white/5 text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-bold text-white min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity >= maxStock) {
                              showToast(`Maximum stock available (${maxStock}) reached for size ${item.selectedSize}.`, 'info');
                              return;
                            }
                            updateCartQuantity(item.id, item.quantity + 1);
                          }}
                          disabled={item.quantity >= maxStock}
                          className="p-1 px-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Move to Wishlist */}
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-[10px] text-white/50 hover:text-[#C7A55B] underline flex items-center gap-1 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span>Wishlist</span>
                      </button>

                      {/* Item Total */}
                      <span className="text-sm font-bold text-[#C7A55B]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#181818] border-t border-white/10 space-y-4">
            {/* Promo Code Input */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-[#C7A55B]/10 border border-[#C7A55B]/40 text-xs">
                <div className="flex items-center gap-2 text-[#C7A55B]">
                  <Tag className="w-4 h-4" />
                  <span className="font-bold">Promo ({appliedCoupon.code}): Saved {formatPrice(discountAmount)}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-white/60 hover:text-white text-[10px] uppercase font-bold underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. BDROYAL, ROYAL10)"
                    value={couponCodeInput}
                    onChange={(e) => {
                      setCouponCodeInput(e.target.value);
                      setCouponError('');
                      setCouponSuccess('');
                    }}
                    className="flex-grow px-3 py-2 bg-[#111111] border border-white/20 text-white text-xs uppercase tracking-wider focus:outline-none focus:border-[#C1121F]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase font-bold tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-400 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-400 mt-1">{couponSuccess}</p>}
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-white/70 pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C7A55B]">
                  <span>Promo Discount</span>
                  <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Courier Charge</span>
                <span className="font-semibold text-white">
                  {shippingFee === 0 ? <strong className="text-emerald-400 uppercase">FREE</strong> : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Grand Total</span>
                <span className="text-[#C7A55B] text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions: Continue Shopping vs Proceed to Checkout */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setView('checkout');
                }}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-xl red-border-glow flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 bg-transparent text-white/70 hover:text-white text-[11px] uppercase tracking-wider font-semibold text-center block transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
