import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { optimizeImageUrl } from '../lib/imageUtils';

export const LimitedDrop: React.FC = () => {
  const { setView, setFilters, products, formatPrice } = useStore();

  // Find the limited drop item or fallback to first product
  const dropProduct = products.find(p => p.category === 'Limited Edition') || products[0];

  // Countdown timer logic (e.g. 2 days, 14 hours, 32 mins, 18 secs)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleShopLimited = () => {
    setFilters(prev => ({ ...prev, category: 'Limited Edition' }));
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#0A0A0A] text-white py-20 px-4 sm:px-6 lg:px-8 border-y border-[#C7A55B]/30 overflow-hidden">
      {/* Premium Red & Gold Atmospheric Background Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C1121F]/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#C7A55B]/15 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C1121F]/20 border border-[#C1121F]/50 text-[#C1121F] text-xs font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 text-[#C1121F] animate-pulse" />
            <span>EXCLUSIVE UNNUMBERED DROP</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            KINGSMAN <span className="text-[#C7A55B] font-royal italic">MONARCH</span> <br />
            GOLD ACCENT EDITION
          </h2>

          <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed font-light">
            Individually inspected and delivered with a certificate of authenticity. Selected for superior comfort, metallic gold-tone detailing, and durable outsoles. Limited quantities imported per drop.
          </p>

          {/* Countdown Clock */}
          <div className="pt-2 pb-4">
            <p className="text-[10px] font-bold text-[#C7A55B] uppercase tracking-[0.25em] mb-3">
              NEXT DROP RELEASE CLOSES IN:
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-[#181818] border border-[#C7A55B]/30 px-4 py-3 min-w-[70px] text-center">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase tracking-widest text-white/50 mt-1">HOURS</span>
              </div>
              <span className="text-xl font-bold text-[#C7A55B]">:</span>
              <div className="bg-[#181818] border border-[#C7A55B]/30 px-4 py-3 min-w-[70px] text-center">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase tracking-widest text-white/50 mt-1">MINS</span>
              </div>
              <span className="text-xl font-bold text-[#C7A55B]">:</span>
              <div className="bg-[#181818] border border-[#C1121F]/60 px-4 py-3 min-w-[70px] text-center">
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#C1121F]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase tracking-widest text-[#C1121F] mt-1">SECS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleShopLimited}
              className="px-8 py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 transition-colors group"
            >
              <Crown className="w-4 h-4 text-[#C7A55B]" />
              <span>Shop Limited Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck className="w-4 h-4 text-[#C7A55B]" />
              <span>Includes Certificate of Authenticity</span>
            </div>
          </div>
        </div>

        {/* Right Sneaker Spotlight */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="absolute w-[320px] h-[320px] bg-[#C7A55B]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative border border-[#C7A55B]/40 bg-[#121212] p-8 shadow-2xl w-full max-w-md text-center">
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#C7A55B] text-black text-[9px] font-black uppercase tracking-widest">
              LIMITED DROP
            </span>

            <img
              src={optimizeImageUrl(dropProduct.images[0], 700, 75)}
              alt={`${dropProduct.name} - Limited Drop Curated Luxury Sneaker`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-contain mx-auto drop-shadow-[0_15px_25px_rgba(199,165,91,0.3)] hover:scale-105 transition-transform duration-500"
            />

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-white">{dropProduct.name}</p>
                <p className="text-[10px] text-white/50 uppercase">Quality-Inspected Import</p>
              </div>
              <p className="font-mono text-base font-black text-[#C7A55B]">
                {formatPrice(dropProduct.price)}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
