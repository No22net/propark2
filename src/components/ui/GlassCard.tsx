import { cn } from '@/lib/utils';

export function GlassCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl',
        hover && 'transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
}
