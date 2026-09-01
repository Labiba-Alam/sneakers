import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    setIsCartOpen, 
    setIsSearchOpen, 
    setIsOrderTrackingOpen 
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F8F8]">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <DesktopNav
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenTracking={() => setIsOrderTrackingOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </div>

      {/* Mobile Top Header Bar */}
      <div className="lg:hidden h-16 px-4 bg-[#F8F8F8]/95 backdrop-blur-md border-b border-[#111111]/10 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-[#111111] focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Center */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#C1121F] text-white font-serif font-black flex items-center justify-center text-xs">
            K
          </div>
          <span className="font-royal text-lg font-black tracking-[0.2em] text-[#111111]">
            KINGSMAN
          </span>
        </div>

        {/* Quick Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-2 text-[#111111] focus:outline-none"
          aria-label="Open Shopping Bag"
        >
          <div className="w-6 h-6 bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center">
            BAG
          </div>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTracking={() => setIsOrderTrackingOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </header>
  );
};
