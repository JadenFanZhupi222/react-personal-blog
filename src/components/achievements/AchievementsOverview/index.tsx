'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { Search } from 'lucide-react';
import { GameGridCard } from '@/components/achievements/GameGridCard';
import { ErrorFunc } from '@/components/features/Error';
import { AchievementsPageSkeleton } from '@/components/skeleton/AchievementsPageSkeleton';
import { Pagination } from '@/components/features/Pagination';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { steamQueryKey, fetchSteamStats } from '@/lib/queries/steam';
import {
  filterGamesByPlaytime,
  ITEMS_PER_PAGE,
} from '@/lib/achievements/parser';
import { formatPlaytime } from '@/lib/utils/format';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { ParsedGame } from '@/lib/steam/parser';

type SortKey = 'playtime' | 'name';

function sortGames(games: ParsedGame[], key: SortKey): ParsedGame[] {
  const copy = [...games];
  if (key === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => b.playtime - a.playtime);
}

export function AchievementsOverview() {
  const { t } = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('playtime');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isPending, error, refetch } = useQuery({
    queryKey: steamQueryKey,
    queryFn: fetchSteamStats,
  });

  const filteredGames = useMemo(() => {
    const all = filterGamesByPlaytime(data?.ownedGames ?? []);
    const trimmed = searchTerm.trim().toLowerCase();
    const filtered = trimmed
      ? all.filter((g) => g.name.toLowerCase().includes(trimmed))
      : all;
    return sortGames(filtered, sortKey);
  }, [data?.ownedGames, sortKey, searchTerm]);

  if (isPending) return <AchievementsPageSkeleton />;
  if (error) return <ErrorFunc onRetry={() => refetch()} />;

  const totalGames = filteredGames.length;
  const totalPlaytime = filteredGames.reduce((sum, g) => sum + g.playtime, 0);
  const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredGames.slice(start, start + ITEMS_PER_PAGE);

  // Featured card: only on page 1, only when sort is 'playtime', only when
  // there's no active search (otherwise 'most played' is misleading)
  const showFeatured = safePage === 1 && sortKey === 'playtime' && !searchTerm.trim();
  const featuredGame = showFeatured ? currentItems[0] : null;
  const restItems = showFeatured ? currentItems.slice(1) : currentItems;

  const handleSortChange = (next: SortKey) => {
    setSortKey(next);
    setCurrentPage(1);
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
        {t.achievements.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-lg">
        <span className="text-foreground font-semibold tabular-nums">{totalGames}</span>{' '}
        {t.achievements.summary.games}
        <span className="mx-2">·</span>
        <span className="text-foreground font-semibold tabular-nums">
          {formatPlaytime(totalPlaytime)}
        </span>{' '}
        {t.achievements.summary.played}
      </p>

      {/* Control bar: search + sort */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t.achievements.searchPlaceholder}
            className="bg-card text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-lg border py-2 pr-3 pl-9 text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{t.achievements.sort.label}</span>
          <div className="bg-card flex gap-1 rounded-lg border p-1">
            {(['playtime', 'name'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className={cn(
                  'rounded-md px-3 py-1 text-sm transition-colors',
                  sortKey === key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t.achievements.sort[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <p className="text-muted-foreground mt-12">{t.achievements.noResults}</p>
      ) : (
        <LazyMotion features={domAnimation}>
          <m.div
            key={`${safePage}-${sortKey}-${searchTerm}`}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredGame && (
              <m.div
                variants={itemVariants}
                className="lg:col-span-2 lg:row-span-2"
              >
                <GameGridCard
                  game={featuredGame}
                  formatPlaytime={formatPlaytime}
                  featured
                  featuredLabel={t.achievements.mostPlayed}
                />
              </m.div>
            )}
            {restItems.map((game) => (
              <m.div key={game.appid} variants={itemVariants}>
                <GameGridCard game={game} formatPlaytime={formatPlaytime} />
              </m.div>
            ))}
          </m.div>
        </LazyMotion>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={safePage}
            total={totalGames}
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
