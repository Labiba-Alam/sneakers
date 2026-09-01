/**
 * KINGSMAN ROYAL SNEAKERS - Enterprise Design Tokens
 * Scalable Design System for Luxury Footwear E-Commerce
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand Core
    primary: '#C1121F',      // Sovereign Royal Crimson
    primaryHover: '#9E0E18',
    primaryLight: '#FDF0F1',
    
    black: '#111111',        // Deep Onyx Black
    white: '#F8F8F8',        // Pure Italian Silk White
    pureWhite: '#FFFFFF',
    
    gold: '#C7A55B',         // 24K Gold Leaf
    goldHover: '#B28E46',
    goldLight: '#FAF6ED',
    
    // Grayscale Palette
    gray: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B',
    },

    // Semantic States
    success: '#15803D',
    successLight: '#F0FDF4',
    warning: '#B45309',
    warningLight: '#FFFBEB',
    error: '#DC2626',
    errorLight: '#FEF2F2',
    info: '#1D4ED8',
    infoLight: '#EFF6FF',
  },

  typography: {
    fontFamilies: {
      display: "'Cinzel', serif",
      serifLuxury: "'Playfair Display', serif",
      sans: "'Plus Jakarta Sans', sans-serif",
    },
    scales: {
      display: {
        fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)',
        lineHeight: '1.05',
        fontWeight: '900',
        letterSpacing: '0.05em',
      },
      h1: {
        fontSize: 'clamp(2rem, 3.5vw + 0.5rem, 3.5rem)',
        lineHeight: '1.1',
        fontWeight: '800',
        letterSpacing: '0.02em',
      },
      h2: {
        fontSize: 'clamp(1.5rem, 2.5vw + 0.5rem, 2.5rem)',
        lineHeight: '1.2',
        fontWeight: '700',
        letterSpacing: '0.01em',
      },
      h3: {
        fontSize: 'clamp(1.25rem, 1.8vw + 0.25rem, 1.85rem)',
        lineHeight: '1.25',
        fontWeight: '700',
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.25rem', // 20px
        lineHeight: '1.3',
        fontWeight: '600',
      },
      h5: {
        fontSize: '1.125rem', // 18px
        lineHeight: '1.35',
        fontWeight: '600',
      },
      bodyXL: {
        fontSize: '1.125rem', // 18px
        lineHeight: '1.6',
        fontWeight: '400',
      },
      body: {
        fontSize: '1rem', // 16px
        lineHeight: '1.5',
        fontWeight: '400',
      },
      caption: {
        fontSize: '0.75rem', // 12px
        lineHeight: '1.4',
        fontWeight: '500',
        letterSpacing: '0.05em',
      },
      button: {
        fontSize: '0.75rem', // 12px
        lineHeight: '1',
        fontWeight: '700',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
      }
    }
  },

  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
    32: '128px',
  },

  containerWidths: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    luxuryMax: '1720px',
  },

  borderRadius: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },

  shadows: {
    subtle: '0 2px 10px rgba(17, 17, 17, 0.04)',
    card: '0 10px 30px -10px rgba(17, 17, 17, 0.08)',
    hover: '0 20px 40px -15px rgba(193, 18, 31, 0.18)',
    goldGlow: '0 0 25px rgba(199, 165, 91, 0.25)',
    crimsonGlow: '0 0 30px rgba(193, 18, 31, 0.3)',
  },

  motion: {
    duration: {
      fast: 0.15,
      standard: 0.3,
      luxury: 0.5,
      slow: 0.8,
    },
    easing: {
      easeOutLuxury: [0.16, 1, 0.3, 1], // Custom smooth ease
      easeInOutLuxury: [0.65, 0, 0.35, 1],
    }
  }
} as const;
