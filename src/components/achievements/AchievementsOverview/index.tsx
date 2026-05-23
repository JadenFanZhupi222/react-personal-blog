'use client';

import { useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { AchievementsStatsCard } from '@/components/achievements/AchievementsStatsCard';
import { GameGridCard } from '@/components/achievements/GameGridCard';
import { ErrorFunc } from '@/components/features/Error';
import { AchievementsPageSkeleton } from '@/components/skeleton/AchievementsPageSkeleton';
import { Pagination } from '@/components/features/Pagination';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { steamQueryKey, fetchSteamStats } from '@/lib/queries/steam';
import {
  filterGamesByPlaytime,
  paginateGames,
  MIN_PLAYTIME_HOURS,
  ITEMS_PER_PAGE,
} from '@/lib/achievements/parser';
import { formatPlaytime } from '@/lib/utils/format';

export function AchievementsOverview() {
  const { t } = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: steamQueryKey,
    queryFn: fetchSteamStats,
  });

  if (isPending) return <AchievementsPageSkeleton />;
  if (error) return <ErrorFunc onRetry={() => refetch()} />;

  const ownedGames = data?.ownedGames ?? [];
  const filteredGames = filterGamesByPlaytime(ownedGames);
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const currentItems = paginateGames(filteredGames, currentPage, ITEMS_PER_PAGE);
  const totalPlaytime = filteredGames.reduce((sum, g) => sum + g.playtime, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <PageHeader heading={t.achievements.title} />

      <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <AchievementsStatsCard
          icon={<Trophy className="h-4 w-4 text-yellow-500" />}
          title={t.achievements.stats.totalGames.title}
          value={filteredGames.length}
          subtitle={t.achievements.stats.totalGames.subtitle.replace(
            '{hours}',
            MIN_PLAYTIME_HOURS.toString()
          )}
        />
        <AchievementsStatsCard
          icon={<Medal className="h-4 w-4 text-yellow-500" />}
          title={t.achievements.stats.totalPlaytime.title}
          value={formatPlaytime(totalPlaytime)}
          subtitle={t.achievements.stats.totalPlaytime.subtitle}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((game) => (
          <GameGridCard key={game.appid} game={game} formatPlaytime={formatPlaytime} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            total={filteredGames.length}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            labels={{
              prev: t.achievements.pagination.prev,
              next: t.achievements.pagination.next,
              goTo: t.achievements.pagination.goTo,
            }}
          />
        </div>
      )}
    </div>
  );
}
