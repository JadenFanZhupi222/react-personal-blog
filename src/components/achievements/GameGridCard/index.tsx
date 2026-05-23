'use client';

import Image from 'next/image';
import { Clock } from 'lucide-react';
import { PendingLink } from '@/components/ui/PendingLink';
import type { ParsedGame } from '@/lib/steam/parser';

interface GameGridCardProps {
  game: ParsedGame;
  formatPlaytime: (minutes: number) => string;
}

export function GameGridCard({ game, formatPlaytime }: GameGridCardProps) {
  return (
    <PendingLink
      href={`/achievements/${game.appid}`}
      className="group bg-card hover:border-primary block overflow-hidden rounded-xl border transition-colors"
    >
      <div className="relative aspect-[460/215] w-full overflow-hidden">
        <Image
          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
          alt={game.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-3">
        <h3 className="text-foreground group-hover:text-primary line-clamp-1 font-semibold transition-colors">
          {game.name}
        </h3>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>{formatPlaytime(game.playtime)}</span>
        </div>
      </div>
    </PendingLink>
  );
}
