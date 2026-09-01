import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ChipProps {
  label: string | number;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  colorHex?: string;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  disabled = false,
  colorHex,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-xs font-bold transition-all duration-200 border rounded-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C1121F]',
        disabled && 'opacity-40 cursor-not-allowed line-through bg-gray-100 text-gray-400 border-gray-200',
        !disabled && selected && 'bg-[#111111] border-[#111111] text-white shadow-sm',
        !disabled && !selected && 'bg-white border-[#111111]/20 text-[#111111] hover:border-[#111111] hover:bg-black/5',
        className
      )}
    >
      {colorHex && (
        <span
          className="w-3.5 h-3.5 rounded-full mr-2 border border-black/20 shrink-0 inline-flex items-center justify-center"
          style={{ backgroundColor: colorHex }}
        >
          {selected && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
};
