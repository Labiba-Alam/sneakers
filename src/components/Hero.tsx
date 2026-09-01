import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { Crown, ArrowRight, ShieldCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { optimizeImageUrl } from '../lib/imageUtils';

export const Hero: React.FC = () => {
  const { setView, setFilters, formatPrice, products } = useStore();
  const [isAudioMuted, setIsAudioMuted] = React.useState(true);

  const flagshipProduct = products.find(p => p.id === 'kng-001') || products[0];

  const handleExplore = (category?: string) => {
    if (category) {
      setFilters(prev => ({ ...prev, category: category as any }));
    }
    setView('catalog');
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-5rem)] bg-[#F8F8F8] overflow-hidden flex items-center justify-center py-12 lg:py-0 border-b border-[#111111]/10">
      {/* Left Vertical Side Rail Badge */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase text-[#111111]/30 select-none pointer-events-none">
        <span>ESTABLISHED MMXXIV — DHAKA</span>
        <div className="w-12 h-[1px] bg-[#C7A55B]/40" />
        <span>CURATED SNEAKER ARCHIVE</span>
      </div>

      {/* Large Background Watermark Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span className="text-[180px] sm:text-[280px] font-royal font-black text-[#111111]/[0.025] tracking-[0.1em] whitespace-nowrap">
          KINGSMAN
        </span>
      </div>

      {/* Background Lighting & Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[500px] bg-[#C1121F]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C7A55B]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#111111 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Brand Typography & Action */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/5 border border-[#C7A55B]/40"
          >
            <Crown className="w-4 h-4 text-[#C7A55B]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#C1121F] uppercase">
              2026 Sovereign Royal Edition
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-2"
          >
            {/* Rule Indicator Line */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-[#C7A55B]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C7A55B]">
                Curated Luxury
              </span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#111111] leading-[1.08]">
              ROYALTY <br />
              <span className="italic font-normal text-[#111111]/70">REDEFINED IN</span> <br />
              <span className="text-[#C1121F]">
                PREMIUM
              </span> SNEAKERS.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#111111]/70 text-sm sm:text-base max-w-lg leading-relaxed font-normal"
          >
            Carefully curated premium sneaker imports delivered across Bangladesh. Every pair is quality-checked before dispatch, featuring gold-tone accents, durable outsoles, and exceptional all-day comfort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto"
          >
            <button
              onClick={() => handleExplore()}
              className="w-full sm:w-auto px-8 py-4 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-none transition-all duration-300 shadow-xl red-border-glow flex items-center justify-center gap-3 group"
            >
              <span>Discover Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleExplore('Limited Edition')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white text-xs uppercase tracking-[0.2em] font-bold rounded-none transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-[#C7A55B]" />
              <span>Limited Drop</span>
            </button>
          </motion.div>

          {/* Value Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-[#111111]/10 w-full"
          >
            <div>
              <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#111111]">100%</p>
              <p className="text-[10px] font-bold tracking-widest text-[#111111]/60 uppercase">Quality Checked</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#C1121F]">Gold</p>
              <p className="text-[10px] font-bold tracking-widest text-[#111111]/60 uppercase">Tone Accents</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#111111]">24-48 Hr</p>
              <p className="text-[10px] font-bold tracking-widest text-[#111111]/60 uppercase">Fast Delivery</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Hero Floating Sneaker Visual */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          
          {/* Dark Contrast Artistic Background Frame */}
          <div className="absolute w-[300px] sm:w-[440px] h-[300px] sm:h-[440px] bg-[#111111] shadow-2xl -rotate-2 border border-[#C7A55B]/30 pointer-events-none" />
          <div className="absolute w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] border border-[#C1121F]/30 pointer-events-none" />

          {/* Floating Sneaker Image Container */}
          <motion.div
            animate={{
              y: [0, -14, 0],
              rotate: [0, -2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10 w-full max-w-lg aspect-square flex items-center justify-center p-6 cursor-pointer group"
            onClick={() => setView('catalog')}
          >
            <img
              src={optimizeImageUrl(flagshipProduct.images[0], 800, 80)}
              alt={`${flagshipProduct.name} - 2026 Sovereign Royal Edition Sneaker`}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(193,18,31,0.4)] group-hover:scale-105 transition-transform duration-700"
            />

            {/* Price Badge Overlay */}
            <div className="absolute bottom-4 left-4 glass-panel-dark px-4 py-2.5 border border-white/10 shadow-2xl flex items-center gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">Flagship Model</p>
                <p className="text-sm font-serif-luxury font-bold text-white">{flagshipProduct.name}</p>
              </div>
              <div className="pl-3 border-l border-white/10">
                <p className="text-sm font-bold text-[#C7A55B]">{formatPrice(flagshipProduct.price)}</p>
              </div>
            </div>
          </motion.div>

          {/* Sound Toggle Floating Button */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="absolute top-2 right-2 p-3 rounded-full bg-white shadow-md border border-[#111111]/10 text-[#111111]/60 hover:text-[#111111] transition-colors"
            title={isAudioMuted ? "Enable Royal Soundscape" : "Mute Soundscape"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C1121F]" />}
          </button>
        </div>

      </div>
    </section>
  );
};
