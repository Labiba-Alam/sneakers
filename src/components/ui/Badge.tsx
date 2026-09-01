import React from 'react';
import { Crown, Sparkles, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'limited' | 'new' | 'bestseller' | 'sale' | 'stock' | 'dark' | 'outline';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'dark',
  children,
  icon = true,
  className,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    limited: 'bg-[#C7A55B] text-black font-black border border-black/10',
    new: 'bg-[#111111] text-white font-bold',
    bestseller: 'bg-[#C1121F] text-white font-bold',
    sale: 'bg-emerald-700 text-white font-bold',
    stock: 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300',
    dark: 'bg-[#111111]/90 text-white font-semibold',
    outline: 'bg-transparent text-[#111111] border border-[#111111]/30 font-bold',
  };

  const renderIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'limited':
        return <Crown className="w-3 h-3 text-black shrink-0" />;
      case 'new':
        return <Sparkles className="w-3 h-3 text-[#C7A55B] shrink-0" />;
      case 'sale':
        return <Tag className="w-3 h-3 text-white shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider leading-none select-none rounded-none',
        variantStyles[variant],
        className
      )}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
};
