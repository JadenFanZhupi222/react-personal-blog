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
      <div className="react-bits-grid-aura__beam absolute top-[-20%] left-1/2 h-[140%] w-1/3 -translate-x-1/2 rotate-12" />
      <div className="react-bits-grid-aura__pulse absolute right-[8%] bottom-[12%] h-72 w-72 rounded-full" />
    </div>
  );
}
