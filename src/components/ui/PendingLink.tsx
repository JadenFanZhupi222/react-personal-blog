'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLinkStatus } from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigationPending } from '@/contexts/NavigationPendingContext';
import type { ComponentProps } from 'react';

/**
 * Link variant that gives instant click feedback: a 2px Apple-style filling
 * underline appears under the clicked link while the new route's RSC payload
 * is in flight. The same pending signal is also reported up to the global
 * NavigationPendingContext, so a viewport-wide TopProgressBar can show even
 * for users looking elsewhere on the page.
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
      <PendingHooks className={indicatorClassName} />
    </Link>
  );
}

function PendingHooks({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  const ctx = useNavigationPending();

  useEffect(() => {
    if (!pending || !ctx) return;
    ctx.report(true);
    return () => ctx.report(false);
  }, [pending, ctx]);

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
