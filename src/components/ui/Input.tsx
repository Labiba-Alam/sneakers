import React, { useId } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className,
  id,
  type = 'text',
  disabled,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {label && (
        <label 
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-[#111111]/80 select-none flex items-center justify-between"
        >
          <span>{label}</span>
          {props.required && <span className="text-[#C1121F] font-normal">*Required</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#111111]/50 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 bg-white border border-[#111111]/20 text-[#111111] text-xs font-medium placeholder:text-[#111111]/40 rounded-none transition-colors duration-200 focus:outline-none focus:border-[#C1121F] focus:ring-1 focus:ring-[#C1121F] disabled:bg-gray-100 disabled:cursor-not-allowed',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-600 focus:border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-[#111111]/50 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
          <span>⚠️ {error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="text-[11px] text-[#111111]/60">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
