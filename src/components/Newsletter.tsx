import React, { useState } from 'react';
import { Crown, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Newsletter: React.FC = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    showToast('Welcome to The Royal Club! Use code FIRSTROYAL for $50 off.');
  };

  return (
    <section className="py-24 bg-[#111111] border-t border-b border-[#111111]/10 relative overflow-hidden text-[#F8F8F8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="w-12 h-12 bg-[#C7A55B]/20 border border-[#C7A55B] text-[#C7A55B] flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-[#C7A55B]" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C7A55B] mb-2">
          INVITATION ONLY ARCHIVE
        </p>

        <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white mb-4">
          JOIN THE ROYAL CLUB
        </h2>

        <p className="text-white/70 text-xs sm:text-sm max-w-lg mx-auto font-normal mb-8 leading-relaxed">
          Subscribe to receive private invitations to limited bespoke drops, private atelier sales, and an instant $50 welcome coupon code.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-4 bg-[#C7A55B]/10 border border-[#C7A55B]/40 text-[#C7A55B] font-bold text-xs uppercase tracking-widest">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>VIP Access Granted! Use promo code FIRSTROYAL at checkout.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your private email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3.5 bg-[#181818] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C1121F]"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-widest transition-all shadow-xl red-border-glow flex items-center justify-center gap-2 shrink-0"
            >
              <span>Join Club</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
