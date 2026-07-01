import { ExternalLink } from 'lucide-react';
import type { ParsedGame } from '@/lib/steam/parser';
import Image from 'next/image';

export interface RecentGamesSectionProps {
  recentGames: ParsedGame[];
  formatPlaytime: (minutes: number) => string;
  onGameClick: (appid: number) => void;
  t: {
    recentGames: string;
  };
}

export function RecentGamesSection({
  recentGames,
  formatPlaytime,
  onGameClick,
  t,
}: RecentGamesSectionProps) {
  if (recentGames.length === 0) return null;

  return (
    <div>
      <h4 className="text-muted-foreground border-border/70 mb-4 border-b pb-2 text-sm font-medium">
        {t.recentGames}
      </h4>
      <div className="space-y-4">
        {recentGames.map((game: ParsedGame) => (
          <div
            key={game.appid}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 transition-all duration-200 hover:border-secondary/30 hover:bg-secondary/10"
            onClick={() => onGameClick(game.appid)}
          >
            <div className="relative h-9 w-16 overflow-hidden rounded-lg">
              <Image
                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                alt={game.name}
                fill
                sizes="64px"
                className="object-cover object-center"
                priority={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.icon}.jpg`;
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate font-medium">{game.name}</p>
                <ExternalLink className="text-secondary h-3 w-3" />
              </div>
            </div>
            <p className="text-sm font-medium text-secondary">{formatPlaytime(game.playtime)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
