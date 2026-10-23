import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Truck, 
  Heart, 
  Crown, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    setIsOrderTrackingOpen,
    setView,
    wishlist
  } = useStore();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeAuthModalRef = useRef(closeAuthModal);
  closeAuthModalRef.current = closeAuthModal;

  // Keyboard navigation: Escape key listener
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModalRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-checkout-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#141414] border border-[#C7A55B]/40 rounded-2xl shadow-2xl overflow-hidden z-10 font-sans text-white"
        >
          {/* Top Gold Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-[#C7A55B] via-[#C1121F] to-[#C7A55B]" />

          {/* Modal Header Bar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#C7A55B]/40 flex items-center justify-center text-[#C7A55B]">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 id="guest-checkout-title" className="font-serif-luxury text-lg font-bold text-white tracking-wide">
                  KINGSMAN GUEST CONCIERGE
                </h2>
                <p className="text-[10px] text-[#C7A55B] uppercase tracking-widest font-semibold">
                  Zero-Hassle Guest Checkout
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Guest-Only Secure Shopping</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                KINGSMAN operates entirely with frictionless <strong>Guest Checkout</strong>. You do not need to create an account, remember passwords, or manage credentials to purchase curated footwear.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">
                Customer Services
              </p>

              {/* Action 1: Order Tracking */}
              <button
                onClick={() => {
                  closeAuthModal();
                  setIsOrderTrackingOpen(true);
                }}
                className="w-full p-4 bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 hover:border-[#C7A55B]/50 rounded-xl flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C1121F]/20 text-[#C1121F] flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">
                      Track an Existing Order
                    </p>
                    <p className="text-[11px] text-white/50">
                      Enter your Order ID and phone number to track live delivery status.
                    </p>
                  </div>
                </div>
              </button>

              {/* Action 2: Wishlist */}
              <button
                onClick={() => {
                  closeAuthModal();
                  setView('wishlist');
                  try { window.history.pushState(null, '', '/wishlist'); } catch {}
                }}
                className="w-full p-4 bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 hover:border-[#C7A55B]/50 rounded-xl flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C7A55B]/20 text-[#C7A55B] flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">
                      My Wishlist ({wishlist.length} saved)
                    </p>
                    <p className="text-[11px] text-white/50">
                      Saved silhouettes stored in your current browser.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Concierge Contact Support */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-3">
                Concierge Assistance
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://wa.me/8801581054939"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/40">WhatsApp</p>
                    <p className="font-mono text-[11px]">01581054939</p>
                  </div>
                </a>

                <a
                  href="mailto:kingsmanszn@gmail.com"
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#C7A55B] shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/40">Email</p>
                    <p className="font-mono text-[11px] truncate">kingsmanszn@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#111111] border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 font-mono">
            <span>KINGSMAN Atelier Dhaka</span>
            <span>Mirpur 12, Block B, Dhaka</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
