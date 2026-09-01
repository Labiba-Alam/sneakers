import React from 'react';
import { Crown, Mail, Phone, MapPin, Instagram, Facebook, Twitter, ArrowRight, ShieldCheck, Award, Lock, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setView, setFilters, setIsOrderTrackingOpen, setIsSizeGuideOpen } = useStore();

  const handleCategoryFilter = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat as any }));
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-[#F8F8F8] pt-20 pb-12 border-t border-white/10 font-sans relative overflow-hidden">
      
      {/* Background Decorative Crest Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C1121F]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Trust Badges Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-16 border-b border-white/10 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#C7A55B]/40 text-[#C7A55B] flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Quality-Checked Imports</h4>
              <p className="text-xs text-white/60">Multi-point inspection</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#C1121F]/40 text-[#C1121F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Numbered Certificate</h4>
              <p className="text-xs text-white/60">Authenticity badge included</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#C7A55B]/40 text-[#C7A55B] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Gold-Tone Hardware</h4>
              <p className="text-xs text-white/60">Aglets & heel crown crests</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-none bg-[#181818] border border-white/20 text-white flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider">Encrypted Checkout</h4>
              <p className="text-xs text-white/60">SSLCommerz, bKash & Card</p>
            </div>
          </div>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-16 border-b border-white/10">
          
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-base shadow-md">
                K
              </div>
              <span className="font-royal text-2xl font-black text-white tracking-[0.25em]">KINGSMAN</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light max-w-sm">
              KINGSMAN brings carefully curated premium sneaker imports to sneaker enthusiasts across Bangladesh. Every pair is quality-checked before dispatch, featuring gold-tone accents, durable outsoles, and exceptional comfort.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="#instagram" className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-9 h-9 bg-white/10 hover:bg-[#C1121F] text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Royal Collections */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-[#C7A55B] uppercase tracking-[0.2em]">Collections</h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-light">
              <li>
                <button onClick={() => handleCategoryFilter('Limited Edition')} className="hover:text-white transition-colors">Limited Drop</button>
              </li>
              <li>
                <button onClick={() => handleCategoryFilter('High Tops')} className="hover:text-white transition-colors">High Tops</button>
              </li>
              <li>
                <button onClick={() => handleCategoryFilter('Low Tops')} className="hover:text-white transition-colors">Low Tops</button>
              </li>
              <li>
                <button onClick={() => handleCategoryFilter('Running')} className="hover:text-white transition-colors">Running Silhouettes</button>
              </li>
              <li>
                <button onClick={() => handleCategoryFilter('Basketball')} className="hover:text-white transition-colors">Court Architecture</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Services & Concierge */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-[0.2em]">Concierge</h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-light">
              <li><button onClick={() => setView('brand-story')} className="hover:text-white transition-colors">Brand Story</button></li>
              <li><button onClick={() => setIsOrderTrackingOpen(true)} className="hover:text-white transition-colors">Track Royal Order</button></li>
              <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition-colors">Size Guide</button></li>
              <li><span className="hover:text-white cursor-pointer">Express Nationwide Shipping</span></li>
              <li>
                <button 
                  onClick={() => {
                    localStorage.removeItem('kingsman_cookie_consent');
                    window.location.reload();
                  }} 
                  className="hover:text-[#C7A55B] text-white/50 transition-colors text-[11px]"
                >
                  Cookie & Privacy Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Private Invitation Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#C7A55B]" />
              <span>Private Invitation Archive</span>
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-white">RECEIVE BESPOKE DROPS</h4>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Subscribe to unlock private invitations to limited unnumbered releases and receive an instant $50 welcome drop code.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to KINGSMAN Royal Archive.'); }} className="flex">
              <input
                type="email"
                required
                placeholder="Enter private email..."
                className="w-full px-4 py-3 bg-[#181818] border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C1121F]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#C1121F] hover:bg-[#9E0E18] text-white text-xs font-bold uppercase tracking-widest shrink-0 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Payment Badges & Copyright Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50">
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C7A55B]" />
            <span>Gulshan Avenue, Dhaka 1212, Bangladesh</span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">bKash</span>
            <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">Nagad</span>
            <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">Rocket</span>
            <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">SSLCommerz</span>
            <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">VISA / MC</span>
            <span className="px-2.5 py-1 bg-white/10 text-white font-mono text-[10px] font-bold">COD</span>
          </div>

          <p className="text-[11px] font-mono tracking-wider">
            © 2026 KINGSMAN ROYAL SNEAKERS. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
};
