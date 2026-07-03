import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-white/80">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all',
            icon && 'pr-10',
            error && 'border-red-500/50 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
