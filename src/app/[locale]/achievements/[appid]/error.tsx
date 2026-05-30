'use client';

import { useEffect } from 'react';
import { ErrorFunc } from '@/components/features/Error';

/**
 * Route error boundary for /[locale]/achievements/[appid].
 * Catches errors thrown by useSuspenseQuery in AchievementDetailPage
 * (and any server-side rendering errors in the route segment).
 */
export default function AchievementDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[achievements/[appid]/error]', error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <ErrorFunc onRetry={reset} />
    </div>
  );
}
