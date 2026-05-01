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

  await Promise.all([
    queryClient
      .prefetchQuery({ queryKey: leetcodeQueryKey, queryFn: getLeetCodeStats })
      .catch(() => {
        /* swallow — client useQuery will surface error */
      }),
    queryClient
      .prefetchQuery({ queryKey: steamQueryKey, queryFn: getSteamStats })
      .catch(() => {
        /* swallow — client useQuery will surface error */
      }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}

export default function Home() {
  return (
    <Suspense>
      <PrefetchedHome />
    </Suspense>
  );
}
