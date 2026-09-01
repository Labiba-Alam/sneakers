import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'gold'
  | 'danger'
  | 'floating';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  onClick,
  ...props
}, ref) => {
  
  // Variant Base Styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#C1121F] text-white hover:bg-[#9E0E18] active:bg-[#7D0B13] border border-transparent shadow-md focus-visible:ring-[#C1121F]',
    secondary: 'bg-[#111111] text-white hover:bg-[#2A2A2A] active:bg-black border border-transparent focus-visible:ring-[#111111]',
    outline: 'bg-transparent text-[#111111] border-2 border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:ring-[#111111]',
    ghost: 'bg-transparent text-[#111111] hover:bg-black/5 active:bg-black/10 focus-visible:ring-[#111111]',
    gold: 'bg-[#C7A55B] text-black font-extrabold hover:bg-[#B28E46] active:bg-[#9E7C35] border border-transparent shadow-md focus-visible:ring-[#C7A55B]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600',
    floating: 'bg-white text-[#111111] border border-[#111111]/15 shadow-xl hover:shadow-2xl hover:scale-105 rounded-full p-4 focus-visible:ring-[#C1121F]'
  };

  // Size Base Styles
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] gap-1.5',
    md: 'px-6 py-3 text-xs font-bold tracking-[0.15em] gap-2',
    lg: 'px-8 py-4 text-sm font-bold tracking-[0.2em] gap-2.5',
    xl: 'px-10 py-5 text-base font-bold tracking-[0.25em] gap-3',
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      whileHover={isDisabled ? undefined : { scale: 1.01 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center uppercase font-sans tracking-widest rounded-none transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer',
        variantStyles[variant],
        variant !== 'floating' && sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
