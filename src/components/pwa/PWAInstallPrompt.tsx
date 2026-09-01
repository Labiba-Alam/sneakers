import React, { useState, useEffect } from 'react';
import { Download, X, Crown, ShieldCheck } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Listen for standard PWA install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt if user hasn't dismissed it in this session
      if (!sessionStorage.getItem('kingsman_pwa_dismissed')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted KINGSMAN PWA installation');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('kingsman_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#111111] text-white border-2 border-[#C7A55B] p-4 rounded-xl shadow-2xl animate-fade-in">
      <button 
        onClick={handleDismiss} 
        className="absolute top-2 right-2 text-white/50 hover:text-white p-1 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C7A55B]/20 border border-[#C7A55B]/60 flex items-center justify-center text-[#C7A55B] shrink-0">
          <Crown className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <p className="font-serif-luxury text-sm font-bold text-white">KINGSMAN Royal Atelier App</p>
          <p className="text-[11px] text-white/70 mt-0.5">
            Install for instant drops, VIP checkout & offline order tracking.
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#C7A55B]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fast • Secure • Mobile Optimized</span>
          </div>

          <button
            onClick={handleInstallClick}
            className="mt-3 w-full py-2 bg-gradient-to-r from-[#C7A55B] to-[#C1121F] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Install KINGSMAN App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
