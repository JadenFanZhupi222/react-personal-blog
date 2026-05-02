'use client';

import { useEffect } from 'react';
import { ErrorFunc } from '@/components/features/Error';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <ErrorFunc onRetry={reset} />
    </div>
  );
}
