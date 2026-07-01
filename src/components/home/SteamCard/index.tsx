'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { GlareCard } from '@/components/effects/GlareCard';
import { Gamepad } from 'lucide-react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { RefreshButton } from '@/components/ui/RefreshButton';
import { SteamCardSkeleton } from './Skeleton';
import { ErrorFunc } from '@/components/features/Error';
import { ProfileSection } from './ProfileSection';
import { RecentGamesSection } from './RecentGamesSection';
import { AchievementsLink } from './AchievementsLink';
import { useQuery } from '@tanstack/react-query';
import { steamQueryKey, fetchSteamStats } from '@/lib/queries/steam';

function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours < 1) {
    return `${minutes}m`;
  }
  return `${hours}h`;
}

export function SteamCard() {
  const { t } = useTranslations();
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: steamQueryKey,
    queryFn: fetchSteamStats,
  });

  const handleGameClick = (appid: number) => {
    window.open(`https://steamcommunity.com/app/${appid}`, '_blank');
  };

  if (isPending) {
    return <SteamCardSkeleton />;
  }

  return (
    <GlareCard subtle className="rounded-xl">
      <Card className="observatory-panel relative h-full overflow-hidden rounded-xl bg-steam-card/90 text-card-foreground">
        <div
          aria-hidden
          className="from-achievement-rare-glow/10 via-achievement-rare-glow/70 pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r to-transparent"
        />
        <CardContent className="relative flex h-full min-h-[320px] flex-col p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground flex items-center gap-2 text-xl font-semibold tracking-[-0.02em]">
              <Gamepad className="text-secondary h-5 w-5" />
              {t.home.activity.steam.title}
            </h2>
            {!error && <RefreshButton onClick={() => refetch()} isLoading={isFetching} />}
          </div>
          {error && <ErrorFunc onRetry={() => refetch()} />}
          {!error &&
            (data?.profile ? (
              <div className="flex flex-1 flex-col space-y-6">
                <ProfileSection
                  profile={data.profile}
                  totalPlaytime={data.totalPlaytime}
                  formatPlaytime={formatPlaytime}
                  t={{
                    totalPlaytime: t.home.activity.steam.totalPlaytime,
                    online: t.home.activity.steam.online,
                    offline: t.home.activity.steam.offline,
                  }}
                />
                <RecentGamesSection
                  recentGames={data.recentGames}
                  formatPlaytime={formatPlaytime}
                  onGameClick={handleGameClick}
                  t={{
                    recentGames: t.home.activity.steam.recentGames,
                  }}
                />
                <AchievementsLink text={t.home.activity.steam.viewAchievements} />
              </div>
            ) : (
              <p className="text-muted-foreground">{t.home.activity.steam.placeholder}</p>
            ))}
        </CardContent>
      </Card>
    </GlareCard>
  );
}
