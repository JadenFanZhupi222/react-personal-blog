'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}

export function GlareCard({ children, className, subtle = false }: GlareCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    ref.current?.style.setProperty('--glare-x', `${x}%`);
    ref.current?.style.setProperty('--glare-y', `${y}%`);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'react-bits-glare-card relative h-full',
        subtle && 'react-bits-glare-card--subtle',
        className
      )}
      onPointerMove={handlePointerMove}
    >
      {children}
    </div>
  );
}
