'use client';

import { cn } from '@/lib/utils';

interface CodeScanlineProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeScanline({ children, className }: CodeScanlineProps) {
  return (
    <div className={cn('react-bits-code-scanline relative', className)}>
      <div aria-hidden="true" className="react-bits-code-scanline__bar" />
      {children}
    </div>
  );
}
