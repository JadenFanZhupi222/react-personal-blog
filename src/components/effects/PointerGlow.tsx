'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function PointerGlow({ className }: { className?: string }) {
  const glowRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  React.useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    const handlePointerMove = (event: PointerEvent) => {
      glow.style.setProperty('--pointer-x', `${event.clientX}px`);
      glow.style.setProperty('--pointer-y', `${event.clientY}px`);
      glow.dataset.active = 'true';
    };

    const handlePointerLeave = () => {
      glow.dataset.active = 'false';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      data-effect="pointer-glow"
      data-active="false"
      className={cn('react-bits-pointer-glow pointer-events-none fixed inset-0 z-0', className)}
    />
  );
}
