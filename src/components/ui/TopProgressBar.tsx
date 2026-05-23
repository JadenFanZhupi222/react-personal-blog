'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useNavigationPending } from '@/contexts/NavigationPendingContext';

/**
 * Viewport-wide pending indicator. A 3px brand-coloured bar slides in from
 * the left when ANY PendingLink is mid-navigation. Uses a "slow crawl" easing
 * (4s to reach 80%) so it always feels like motion is happening, even on slow
 * routes — like YouTube/NProgress, but driven by Next.js useLinkStatus instead
 * of pathname polling.
 *
 * On route resolution the bar snaps to 100% then fades out in 400ms.
 */
export function TopProgressBar() {
  const ctx = useNavigationPending();
  const pending = ctx?.pending ?? false;

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        aria-hidden
        className="bg-secondary pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[3px] origin-left rounded-r-full shadow-[0_0_8px_var(--secondary)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          pending
            ? { scaleX: [0.05, 0.4, 0.8], opacity: 1 }
            : { scaleX: 1, opacity: 0 }
        }
        transition={
          pending
            ? { duration: 4, times: [0, 0.3, 1], ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.4, ease: 'easeOut' }
        }
      />
    </LazyMotion>
  );
}
