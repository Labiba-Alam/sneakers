import { Variants } from 'framer-motion';

/**
 * KINGSMAN Animation System
 * Smooth, subtle, and luxury-grade motion transitions
 */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, y: 16, transition: { duration: 0.25 } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 15 },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)', 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, filter: 'blur(6px)', transition: { duration: 0.2 } },
};

export const hoverLift = {
  rest: { y: 0, boxShadow: '0 4px 12px rgba(17, 17, 17, 0.05)' },
  hover: { 
    y: -6, 
    boxShadow: '0 20px 35px -10px rgba(193, 18, 31, 0.15)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  tap: { y: -2, transition: { duration: 0.1 } }
};

export const imageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    }
  }
};

export const megaMenuSlide: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.99 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18 } },
};
