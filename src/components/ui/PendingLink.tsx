'use client';

import Link from 'next/link';
import { useLinkStatus } from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

/**
 * Link variant that shows a Apple-style filling underline while the click is
 * pending (RSC payload in flight). When the route resolves, the line collapses
 * back to zero width in 200ms. Renders nothing extra when idle.
 *
 * Use for primary nav targets where the user wants instant feedback on click.
 * For text/inline links inside content, prefer the raw <Link>: the route's
 * loading.tsx skeleton will take over fast enough.
 */
export function PendingLink({
  href,
  className,
  children,
  indicatorClassName,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof Link>, 'children'> & {
  children: React.ReactNode;
  indicatorClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn('relative inline-block', className)}
      onClick={onClick}
      {...rest}
    >
      {children}
      <PendingUnderline className={indicatorClassName} />
    </Link>
  );
}

function PendingUnderline({ className }: { className?: string }) {
  const { pending } = useLinkStatus();

  return (
    <LazyMotion features={domAnimation}>
      <m.span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -bottom-1 left-0 h-0.5 origin-left rounded-full bg-current',
          className
        )}
        initial={{ width: '0%', opacity: 0 }}
        animate={
          pending
            ? { width: ['0%', '60%', '90%'], opacity: 1 }
            : { width: '0%', opacity: 0 }
        }
        transition={
          pending
            ? { duration: 1.2, times: [0, 0.3, 1], ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.2, ease: 'easeOut' }
        }
      />
    </LazyMotion>
  );
}
