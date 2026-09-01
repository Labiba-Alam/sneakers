import React, { useState, useEffect } from 'react';
import { 
  getCookieConsent, 
  grantTrackingConsent, 
  declineTrackingConsent, 
  initTrackingScripts 
} from '../lib/analytics';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent choice
    const consent = getCookieConsent();
    if (!consent) {
      // Small timeout for smooth initial load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (consent === 'granted') {
      // Initialize analytics scripts if previously granted
      initTrackingScripts();
    }
  }, []);

  const handleAccept = () => {
    grantTrackingConsent();
    setIsVisible(false);
  };

  const handleDecline = () => {
    declineTrackingConsent();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-label="Cookie and Privacy Preferences"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-[#141414]/95 backdrop-blur-md border border-white/15 p-5 shadow-2xl text-white font-sans"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C7A55B]/15 border border-[#C7A55B]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-4 h-4 text-[#C7A55B]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-serif-luxury text-sm font-bold text-white tracking-wide">
                  Privacy & Cookie Preferences
                </h4>
                <button
                  onClick={handleDecline}
                  className="text-white/40 hover:text-white transition-colors p-1"
                  aria-label="Dismiss cookie banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-white/70 leading-relaxed font-light mb-3">
                KINGSMAN uses cookies and analytics to enhance your bespoke footwear shopping experience,
                curate tailored recommendations, and optimize nationwide delivery across Bangladesh.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2 px-3 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-3 h-3" />
                  <span>Accept All</span>
                </button>

                <button
                  onClick={handleDecline}
                  className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-[11px] font-semibold tracking-wider transition-colors cursor-pointer"
                >
                  <span>Decline</span>
                </button>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-[#C7A55B]/80 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-[#C7A55B]" />
                <span>Encrypted & Compliant Browsing</span>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
