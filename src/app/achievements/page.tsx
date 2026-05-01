import { Suspense } from 'react';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import AchievementsPage from '@/components/achievements';
import { makeQueryClient } from '@/lib/queryClient';
import { steamQueryKey } from '@/lib/queries/steam';
import { getSteamStats } from '@/lib/steam/server';

async function PrefetchedAchievements() {
  await connection();
  const queryClient = makeQueryClient();

  await queryClient
    .prefetchQuery({ queryKey: steamQueryKey, queryFn: getSteamStats })
    .catch(() => {
      /* swallow — client useQuery will surface error */
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AchievementsPage />
    </HydrationBoundary>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PrefetchedAchievements />
    </Suspense>
  );
}
