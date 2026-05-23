'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { AchievementsStatsCard } from '@/components/achievements/AchievementsStatsCard';
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

  const achievedCount = achievements.filter((a) => a.achieved).length;
  const completionPct =
    achievements.length > 0 ? Math.round((achievedCount / achievements.length) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Link
        href="/achievements"
        className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.achievements.title}
      </Link>

      {game && (
        <>
          <div className="relative aspect-[1920/620] w-full overflow-hidden rounded-2xl">
            <Image
              src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`}
              alt={game.name}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight">{game.name}</h1>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AchievementsStatsCard
              icon={<Clock className="h-4 w-4 text-yellow-500" />}
              title={t.achievements.stats.totalPlaytime.title}
              value={formatPlaytime(game.playtime)}
              subtitle={game.name}
            />
            <AchievementsStatsCard
              icon={<Trophy className="h-4 w-4 text-yellow-500" />}
              title={t.achievements.stats.achievements.title}
              value={
                achievements.length > 0 ? `${achievedCount} / ${achievements.length}` : '—'
              }
              subtitle={t.achievements.stats.achievements.subtitle.replace(
                '{percentage}',
                `${completionPct}%`
              )}
            />
          </div>
        </>
      )}

      <h2 className="text-foreground mt-12 mb-6 text-xl font-bold">
        {t.achievements.title}
      </h2>

      {achievementsLoading ? (
        <AchievementsCardSkeleton />
      ) : achievementsError ? (
        <ErrorFunc onRetry={() => refetchAchievements()} />
      ) : achievements.length === 0 ? (
        <p className="text-muted-foreground">{t.achievements.noAchievements}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {achievements.map((ach, idx) => (
            <AchievementCard key={ach.name ?? idx} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
}
