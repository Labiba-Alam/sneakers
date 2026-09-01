import React from 'react';
import { motion } from 'framer-motion';
import { Star, Crown, ArrowUpRight, CheckCircle2, Ticket } from 'lucide-react';
import { Product, ProductReview, Coupon } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';
import { Badge } from './Badge';

export type CardVariant = 'product' | 'category' | 'review' | 'feature' | 'coupon';

export interface CardProps {
  variant?: CardVariant;
  product?: Product;
  review?: ProductReview;
  coupon?: Coupon;
  title?: string;
  subtitle?: string;
  image?: string;
  icon?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'feature',
  product,
  review,
  coupon,
  title,
  subtitle,
  image,
  icon,
  onAction,
  className,
}) => {
  // 1. Coupon Card Variant
  if (variant === 'coupon' && coupon) {
    return (
      <div className={cn('bg-white border-2 border-dashed border-[#C7A55B] p-5 relative flex items-center justify-between shadow-sm hover:shadow-md transition-shadow', className)}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#C1121F]" />
            <span className="font-mono text-sm font-black tracking-widest text-[#111111] uppercase">{coupon.code}</span>
          </div>
          <p className="text-xs text-[#111111]/70 font-medium">{coupon.description}</p>
          <p className="text-[10px] text-gray-500">Min Spend: ${coupon.minSpend}</p>
        </div>
        <button
          onClick={onAction}
          className="px-3 py-1.5 bg-[#111111] text-white hover:bg-[#C1121F] text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          Apply Code
        </button>
      </div>
    );
  }

  // 2. Review Card Variant
  if (variant === 'review' && review) {
    return (
      <div className={cn('bg-white border border-[#111111]/10 p-6 space-y-4 shadow-sm hover:shadow-md transition-all', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {review.userAvatar && (
              <img src={review.userAvatar} alt={review.author} className="w-10 h-10 rounded-full object-cover border border-[#C7A55B]" />
            )}
            <div>
              <h4 className="font-serif-luxury text-sm font-bold text-[#111111]">{review.author}</h4>
              {review.verifiedPurchase && (
                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Royal Buyer
                </p>
              )}
            </div>
          </div>
          <div className="flex text-[#C7A55B]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#C7A55B]' : 'text-gray-300'}`} />
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-serif-luxury text-sm font-bold text-[#111111] mb-1">"{review.title}"</h5>
          <p className="text-xs text-[#111111]/75 leading-relaxed font-normal">{review.comment}</p>
        </div>
        <p className="text-[10px] text-[#111111]/40 font-semibold pt-2 border-t border-[#111111]/10">{review.date}</p>
      </div>
    );
  }

  // 3. Feature Card Variant
  if (variant === 'feature') {
    return (
      <div className={cn('bg-white border border-[#111111]/10 p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-[#C1121F] transition-all duration-300 group', className)}>
        {icon && (
          <div className="w-12 h-12 bg-[#111111] text-[#C7A55B] flex items-center justify-center group-hover:bg-[#C1121F] group-hover:text-white transition-colors">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="font-serif-luxury text-lg font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-[#111111]/70 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  // 4. Default Category / Generic Card Variant
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onAction}
      className={cn('group relative overflow-hidden cursor-pointer border border-[#111111]/15 bg-white shadow-sm hover:shadow-xl transition-all duration-300', className)}
    >
      {image && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title || 'Kingdom sneaker card'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
          />
        </div>
      )}
      <div className="p-5 flex items-center justify-between">
        <div>
          {title && <h3 className="font-serif-luxury text-base font-bold text-[#111111] group-hover:text-[#C1121F] transition-colors">{title}</h3>}
          {subtitle && <p className="text-xs text-[#111111]/60 mt-0.5">{subtitle}</p>}
        </div>
        <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center group-hover:bg-[#C1121F] transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};
