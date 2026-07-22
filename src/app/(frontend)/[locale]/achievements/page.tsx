import { Suspense } from 'react';
import { connection } from 'next/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AchievementsOverview } from '@/components/achievements/AchievementsOverview';
import { AchievementsPageSkeleton } from '@/components/skeleton/AchievementsPageSkeleton';
import { makeQueryClient } from '@/lib/queryClient';
import { steamQueryKey } from '@/lib/queries/steam';
import { getSteamStats } from '@/lib/steam/server';

async function PrefetchedAchievements() {
  await connection();
  const queryClient = makeQueryClient();

  // Errors from the prefetch propagate to error.tsx (via the client-side
  // useSuspenseQuery, which throws on the hydrated error state).
  await queryClient.prefetchQuery({
    queryKey: steamQueryKey,
    queryFn: getSteamStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AchievementsOverview />
    </HydrationBoundary>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AchievementsPageSkeleton />}>
      <PrefetchedAchievements />
    </Suspense>
  );
}
