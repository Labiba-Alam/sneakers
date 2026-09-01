import React from 'react';
import { Crown } from 'lucide-react';

export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  headerNav: React.ReactNode;
  footerNav: React.ReactNode;
  announcementText?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  headerNav,
  footerNav,
  announcementText = 'EXCLUSIVE 2026 FLORENCE ATELIER DROPS — FREE EXPRESS GLOBAL SHIPPING ON ALL ORDERS',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F8] text-[#111111] font-sans antialiased selection:bg-[#C1121F] selection:text-white">
      {/* Accessibility Skip-To-Main-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#C1121F] text-white font-bold text-xs uppercase tracking-widest outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-[#F8F8F8] text-[10px] md:text-xs tracking-[0.25em] py-2 px-4 text-center font-bold uppercase flex items-center justify-center gap-2 border-b border-white/10 select-none">
        <Crown className="w-3.5 h-3.5 text-[#C7A55B] shrink-0" />
        <span className="truncate">{announcementText}</span>
      </div>

      {/* Sticky Main Header */}
      {headerNav}

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
        {children}
      </main>

      {/* Main Footer Landmark */}
      {footerNav}
    </div>
  );
};
