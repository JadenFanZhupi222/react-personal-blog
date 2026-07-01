'use client';

import { cn } from '@/lib/utils';

interface GridAuraProps {
  className?: string;
  intensity?: 'quiet' | 'standard';
}

export function GridAura({ className, intensity = 'standard' }: GridAuraProps) {
  return (
    <div
      aria-hidden="true"
      data-effect="grid-aura"
      className={cn(
        'react-bits-grid-aura pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        intensity === 'quiet' && 'opacity-45',
        className
      )}
    >
      <div className="react-bits-grid-aura__grid absolute inset-0" />
      <div className="react-bits-grid-aura__beam absolute top-[-24%] left-1/2 h-[150%] w-1/3 -translate-x-1/2 rotate-12" />
      <div className="react-bits-grid-aura__pulse absolute right-[8%] bottom-[12%] h-80 w-80 rounded-full" />
      <div className="absolute top-[18%] right-[18%] h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_22px_var(--primary)]" />
      <div className="absolute bottom-[28%] left-[12%] h-px w-40 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
