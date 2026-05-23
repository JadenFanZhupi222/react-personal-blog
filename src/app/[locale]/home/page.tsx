import { Suspense } from 'react';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { HomePage } from '@/components/home';
import { makeQueryClient } from '@/lib/queryClient';
import { leetcodeQueryKey } from '@/lib/queries/leetcode';
import { steamQueryKey } from '@/lib/queries/steam';
import { getLeetCodeStats } from '@/lib/leetcode/server';
import { getSteamStats } from '@/lib/steam/server';

async function PrefetchedHome() {
  await connection();
  const queryClient = makeQueryClient();

  // Race prefetches against a hard timeout. If an upstream (Steam, LeetCode)
  // is slow or silently blackholed, we'd rather ship the shell — client
  // useQuery will retry and the cards have their own isPending skeletons —
  // than hang the whole Suspense boundary on a stuck fetch.
  const PREFETCH_BUDGET_MS = 1500;
  const prefetches = Promise.all([
    queryClient
      .prefetchQuery({ queryKey: leetcodeQueryKey, queryFn: getLeetCodeStats })
      .catch(() => {}),
    queryClient
      .prefetchQuery({ queryKey: steamQueryKey, queryFn: getSteamStats })
      .catch(() => {}),
  ]);
  await Promise.race([
    prefetches,
    new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_BUDGET_MS)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeShellFallback />}>
      <PrefetchedHome />
    </Suspense>
  );
}

function HomeShellFallback() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center" aria-hidden>
      <div className="border-primary/30 border-t-primary h-10 w-10 animate-spin rounded-full border-[3px]" />
    </div>
  );
}
