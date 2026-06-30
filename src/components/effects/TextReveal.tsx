'use client';

import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  className?: string;
}

export function TextReveal({ text, as: Component = 'span', className }: TextRevealProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <Component
      className={cn(
        'react-bits-text-reveal text-wrap-balance inline-block',
        reduced && 'react-bits-text-reveal--static',
        className
      )}
    >
      {text}
    </Component>
  );
}
