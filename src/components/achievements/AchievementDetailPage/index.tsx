'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { AchievementsCardSkeleton } from '@/components/skeleton/AchievementsCardSkeleton';
import { ErrorFunc } from '@/components/features/Error';
import {
  steamQueryKey,
  fetchSteamStats,
  steamAchievementsQueryKey,
  fetchSteamAchievements,
} from '@/lib/queries/steam';
import { formatPlaytime } from '@/lib/utils/format';

export function AchievementDetailPage({ appid }: { appid: number }) {
  const { t, locale } = useTranslations();

  const { data: steamData, error: steamError } = useQuery({
    queryKey: steamQueryKey,
    queryFn: fetchSteamStats,
  });

  const game = steamData?.ownedGames.find((g) => g.appid === appid);

  const {
    data: achievements = [],
    isFetching: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useQuery({
    queryKey: steamAchievementsQueryKey(appid, locale),
    queryFn: () => fetchSteamAchievements(appid, locale),
  });

  if (steamError) return <ErrorFunc />;

  const achievedAchs = achievements
    .filter((a) => a.achieved)
    .sort((a, b) => (b.unlocktime ?? 0) - (a.unlocktime ?? 0));
  const lockedAchs = achievements
    .filter((a) => !a.achieved)
    .sort((a, b) => {
      const rA = typeof a.rarity === 'number' ? a.rarity : 9999;
      const rB = typeof b.rarity === 'number' ? b.rarity : 9999;
      return rA - rB;
    });
  const achievedCount = achievedAchs.length;
  const total = achievements.length;
  const completionPct = total > 0 ? Math.round((achievedCount / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Full-bleed hero — breaks out of the standard max-w-7xl page container.
          Library_hero artwork fills the viewport width; a downward gradient
          fades into the page background so the transition is seamless. */}
      <div className="relative aspect-[1920/620] w-full overflow-hidden">
        {game && (
          <Image
            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`}
            alt={game.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        {/* Vertical scrim — strong at bottom for legibility, top stays clear */}
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        {/* Side scrim — left side darkened for title legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Back link, top-left, floating chip */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <Link
            href="/achievements"
            className="bg-background/40 text-foreground hover:bg-background/60 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.achievements.title}
          </Link>
        </div>

        {/* Title + inline stats, bottom-left, in the max-w-7xl gutter */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
            {game && (
              <>
                <h1 className="text-3xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                  {game.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-white/85 drop-shadow-md sm:text-lg">
                  <span className="tabular-nums">{formatPlaytime(game.playtime)}</span>
                  {total > 0 && (
                    <>
                      <span className="text-white/50">·</span>
                      <span className="tabular-nums">
                        {achievedCount}/{total} {t.achievements.stats.achievements.title}
                      </span>
                      <span className="text-white/50">·</span>
                      <span className="tabular-nums">{completionPct}%</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Achievement sections, in the centered content gutter */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {achievementsLoading ? (
          <AchievementsCardSkeleton />
        ) : achievementsError ? (
          <ErrorFunc onRetry={() => refetchAchievements()} />
        ) : achievements.length === 0 ? (
          <p className="text-muted-foreground">{t.achievements.noAchievements}</p>
        ) : (
          <>
            {achievedAchs.length > 0 && (
              <section>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="text-foreground text-xl font-bold">{t.achievements.achieved}</h2>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {achievedAchs.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {achievedAchs.map((ach, idx) => (
                    <AchievementCard key={ach.name ?? `a-${idx}`} achievement={ach} />
                  ))}
                </div>
              </section>
            )}

            {lockedAchs.length > 0 && (
              <section>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="text-foreground text-xl font-bold">{t.achievements.locked}</h2>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    {lockedAchs.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {lockedAchs.map((ach, idx) => (
                    <AchievementCard key={ach.name ?? `l-${idx}`} achievement={ach} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
