'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { GameGridCard } from '@/components/achievements/GameGridCard';
import { ErrorFunc } from '@/components/features/Error';
import { AchievementsPageSkeleton } from '@/components/skeleton/AchievementsPageSkeleton';
import { Pagination } from '@/components/features/Pagination';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { steamQueryKey, fetchSteamStats } from '@/lib/queries/steam';
import {
  filterGamesByPlaytime,
  paginateGames,
  ITEMS_PER_PAGE,
} from '@/lib/achievements/parser';
import { formatPlaytime } from '@/lib/utils/format';
import { containerVariants, itemVariants } from '@/lib/animations';

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
      {/* Typographic header: title + single-line numeric summary. Replaces the
          two stats cards — same info, much less visual chrome. */}
      <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
        {t.achievements.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">
        <span className="text-foreground font-semibold tabular-nums">
          {filteredGames.length}
        </span>{' '}
        {t.achievements.summary.games}
        <span className="mx-2">·</span>
        <span className="text-foreground font-semibold tabular-nums">
          {formatPlaytime(totalPlaytime)}
        </span>{' '}
        {t.achievements.summary.played}
      </p>

      <LazyMotion features={domAnimation}>
        <m.div
          key={currentPage}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentItems.map((game) => (
            <m.div key={game.appid} variants={itemVariants}>
              <GameGridCard game={game} formatPlaytime={formatPlaytime} />
            </m.div>
          ))}
        </m.div>
      </LazyMotion>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
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
