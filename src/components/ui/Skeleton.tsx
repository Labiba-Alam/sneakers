import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'productCard';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  if (variant === 'productCard') {
    return (
      <div className="bg-white border border-[#111111]/10 p-4 space-y-3 animate-pulse">
        <div className="w-full aspect-square bg-gray-200" />
        <div className="space-y-2 pt-2">
          <div className="h-3 w-1/3 bg-gray-200" />
          <div className="h-5 w-3/4 bg-gray-300" />
          <div className="h-3 w-1/2 bg-gray-200" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="h-5 w-20 bg-gray-300" />
          <div className="h-4 w-12 bg-gray-200" />
        </div>
      </div>
    );
  }

  const baseStyles = 'animate-pulse bg-gray-200';
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    text: 'h-4 w-full rounded-none',
    productCard: '',
  };

  return <div className={cn(baseStyles, variantStyles[variant], className)} />;
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} variant="productCard" />
      ))}
    </div>
  );
};
