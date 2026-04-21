import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#111111]">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-[#E8E4DF] bg-white px-4 py-3 text-sm text-[#111111] placeholder-[#8C8880]',
            'focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent',
            'transition-all duration-150',
            error && 'border-red-400 focus:ring-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
