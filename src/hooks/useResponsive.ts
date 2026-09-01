import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'ultrawide';

export function useResponsive() {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isLaptop = width >= 1024 && width < 1280;
  const isDesktop = width >= 1280 && width < 1536;
  const isUltraWide = width >= 1536;

  let currentBreakpoint: Breakpoint = 'desktop';
  if (isMobile) currentBreakpoint = 'mobile';
  else if (isTablet) currentBreakpoint = 'tablet';
  else if (isLaptop) currentBreakpoint = 'laptop';
  else if (isDesktop) currentBreakpoint = 'desktop';
  else if (isUltraWide) currentBreakpoint = 'ultrawide';

  return {
    width,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isUltraWide,
    breakpoint: currentBreakpoint,
    isTouchDevice: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  };
}
