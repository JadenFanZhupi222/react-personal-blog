import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AchievementDetailPage } from '@/components/achievements/AchievementDetailPage';
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
  await queryClient
    .prefetchQuery({ queryKey: steamQueryKey, queryFn: getSteamStats })
    .catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AchievementDetailPage appid={appid} />
    </HydrationBoundary>
  );
}

export default function Page({ params }: { params: Promise<{ appid: string }> }) {
  return (
    <Suspense>
      <PrefetchedDetail params={params} />
    </Suspense>
  );
}
