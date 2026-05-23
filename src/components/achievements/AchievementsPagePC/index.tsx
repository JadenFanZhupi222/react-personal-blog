import { useState } from 'react';
import { AchievementsStatsCard } from '../AchievementsStatsCard';
import { AchievementsGameCard } from '../AchievementsGameCard';
import { Trophy, Medal } from 'lucide-react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import type { ParsedGame } from '@/lib/steam/parser';
import {
  filterGamesByPlaytime,
  paginateGames,
  MIN_PLAYTIME_HOURS,
  ITEMS_PER_PAGE,
} from '@/lib/achievements/parser';
import { formatPlaytime } from '@/lib/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementsPageSkeleton } from '@/components/skeleton/AchievementsPageSkeleton';
import { ErrorFunc } from '@/components/features/Error';
import { AchievementsListCard } from '../AchievementsListCard';
import { Pagination } from '@/components/features/Pagination';
import { useQuery } from '@tanstack/react-query';
import { steamQueryKey, fetchSteamStats } from '@/lib/queries/steam';
import {
  steamAchievementsQueryKey,
  fetchSteamAchievements,
} from '@/lib/queries/steam';

export function AchievementsPagePC() {
  const { t, locale } = useTranslations();
  const {
    data: steamData,
    isPending: ownedGamesLoading,
    error,
    refetch: refetchSteam,
  } = useQuery({
    queryKey: steamQueryKey,
    queryFn: fetchSteamStats,
  });
  const ownedGames = steamData?.ownedGames ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredAppId, setHoveredAppId] = useState<number | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  const {
    data: achievements = [],
    isFetching: achievementDetailLoading,
    error: achievementDetailError,
    refetch: refetchAchievements,
  } = useQuery({
    queryKey: selectedAppId
      ? steamAchievementsQueryKey(selectedAppId, locale)
      : ['steam', 'achievements', 'idle'],
    queryFn: () => fetchSteamAchievements(selectedAppId!, locale),
    enabled: selectedAppId !== null,
  });

  if (ownedGamesLoading) {
    return <AchievementsPageSkeleton />;
  }
  if (error) {
    return <ErrorFunc onRetry={() => refetchSteam()} />;
  }

  const filteredGames: ParsedGame[] = filterGamesByPlaytime(ownedGames);
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const currentItems = paginateGames(filteredGames, currentPage, ITEMS_PER_PAGE);

  const selectedGame = selectedAppId ? currentItems.find((g) => g.appid === selectedAppId) : null;

  const handleGameClick = (appid: number) => {
    setSelectedAppId(appid === selectedAppId ? null : appid);
    setHoveredAppId(appid);
  };

  return (
    <div className="relative container mx-auto py-8">
      {/* 背景层：只在选中游戏时显示，用 header.jpg（~50KB）而不是 library_hero.jpg
          （~1MB+），因为反正会被高斯模糊糊成色块，分辨率高也看不出来。 */}
      <AnimatePresence mode="wait">
        {selectedGame && (
          <motion.div
            key={selectedGame.appid}
            className="pointer-events-none fixed inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{
              backgroundImage: `url(https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedGame.appid}/header.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px) brightness(0.6)',
            }}
          />
        )}
      </AnimatePresence>

      {/* 内容区 */}
      <div className="relative z-10">
        {/* 高斯模糊毛玻璃标题条 */}
        <div className="relative mb-6 w-fit">
          <div className="bg-card-30 absolute inset-0 rounded-lg backdrop-blur" />
          <h1 className="relative z-10 px-6 py-2 text-3xl font-bold">{t.achievements.title}</h1>
        </div>
        <div className="mb-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
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
            value={formatPlaytime(filteredGames.reduce((sum, g) => sum + g.playtime, 0))}
            subtitle={t.achievements.stats.totalPlaytime.subtitle}
          />
        </div>

        {/* 提示文字移到flex外部 */}
        <div className="mb-2 text-center text-sm text-gray-500">{t.achievements.clickToView}</div>
        <div className="flex min-h-[40rem] w-full flex-col md:flex-row">
          {/* 左侧：游戏列表 */}
          <div className="mx-auto w-full space-y-4 px-2 md:w-1/2">
            {/* 游戏卡片列表 */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {currentItems.map((item, idx) => {
                  const isLast = idx === currentItems.length - 1;
                  return (
                    <div key={item.appid} className={isLast ? 'w-full' : 'mb-4 w-full'}>
                      <AchievementsGameCard
                        item={item}
                        isHovered={hoveredAppId === item.appid}
                        isMobile={false}
                        t={{
                          ...t,
                          formatPlaytime,
                        }}
                        onMouseEnter={() => setHoveredAppId(item.appid)}
                        onMouseLeave={() => setHoveredAppId(null)}
                        onClick={() => handleGameClick(item.appid)}
                      />
                    </div>
                  );
                })}
                {/* 占位补齐，保证高度一致，避免最后一页高度跳变（仅PC端） */}
                {Array.from({ length: Math.max(0, 5 - currentItems.length) }).map((_, idx) => (
                  <div key={`placeholder-${idx}`} className="mb-4 h-[8.625rem] md:h-[8.625rem]" />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* 右侧：大图展示区+成就内容（仅桌面端） */}
          <div className="relative flex max-h-[80vh] min-h-[340px] w-full flex-col items-start justify-start md:w-1/2">
            <AnimatePresence mode="wait">
              {selectedGame && (
                <motion.div
                  key={selectedGame.appid}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="flex h-full w-full justify-center"
                >
                  <AchievementsListCard
                    selectedGame={selectedGame}
                    achievements={achievements}
                    loading={achievementDetailLoading}
                    error={achievementDetailError ? String(achievementDetailError) : null}
                    onRetry={() => refetchAchievements()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <Pagination
              currentPage={currentPage}
              total={filteredGames.length}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              isMobile={false}
              labels={{
                prev: t.achievements.pagination.prev,
                next: t.achievements.pagination.next,
                goTo: t.achievements.pagination.goTo,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
