import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AchievementDetailPage } from '@/components/achievements/AchievementDetailPage';
import { AchievementDetailHeroSkeleton } from '@/components/skeleton/AchievementDetailHeroSkeleton';
import { AchievementsCardSkeleton } from '@/components/skeleton/AchievementsCardSkeleton';
import { makeQueryClient } from '@/lib/queryClient';
import { steamQueryKey } from '@/lib/queries/steam';
import { getSteamStats } from '@/lib/steam/server';

async function PrefetchedDetail({ params }: { params: Promise<{ appid: string }> }) {
  // params access lives inside the Suspense boundary so the route's static
  // shell (root layout + LocaleLayout + Navbar) can prerender without needing
  // the appid value — required by Next.js 16 Cache Components.
  const { appid: rawAppid } = await params;
  const appid = Number(rawAppid);
  if (!Number.isFinite(appid)) return notFound();

  await connection();
  const queryClient = makeQueryClient();

  // Steam stats (owned games) is shared with the overview, so it's almost
  // always cache-hot. Achievements are fetched client-side via /api/steam/...
  // because they're per-language and locale lives on the cookie/client store.
  // Errors propagate to error.tsx via useSuspenseQuery on the client.
  await queryClient.prefetchQuery({
    queryKey: steamQueryKey,
    queryFn: getSteamStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AchievementDetailPage appid={appid} />
    </HydrationBoundary>
  );
}

function DetailLoadingFallback() {
  return (
    <div className="w-full">
      <AchievementDetailHeroSkeleton />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AchievementsCardSkeleton />
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ appid: string }> }) {
  return (
    <Suspense fallback={<DetailLoadingFallback />}>
      <PrefetchedDetail params={params} />
    </Suspense>
  );
}
