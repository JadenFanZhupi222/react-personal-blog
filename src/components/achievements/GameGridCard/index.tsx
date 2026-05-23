'use client';

import Image from 'next/image';
import { Clock, Trophy } from 'lucide-react';
import { PendingLink } from '@/components/ui/PendingLink';
import { cn } from '@/lib/utils';
import type { ParsedGame } from '@/lib/steam/parser';

interface GameGridCardProps {
  game: ParsedGame;
  formatPlaytime: (minutes: number) => string;
  /** Featured cards span 2x2 in the grid and get a prominence badge + bigger type. */
  featured?: boolean;
  featuredLabel?: string;
}

export function GameGridCard({
  game,
  formatPlaytime,
  featured = false,
  featuredLabel,
}: GameGridCardProps) {
  return (
    <PendingLink
      href={`/achievements/${game.appid}`}
      className={cn(
        'group ring-primary/40 relative block aspect-[460/215] overflow-hidden rounded-xl ring-0 transition-shadow duration-300 hover:shadow-2xl hover:ring-2',
        featured && 'h-full lg:aspect-auto'
      )}
    >
      <Image
        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
        alt={game.name}
        fill
        sizes={
          featured
            ? '(max-width: 1024px) 100vw, 50vw'
            : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
        }
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        priority={featured}
      />

      {/* Bottom gradient scrim */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

      {/* Featured badge top-left */}
      {featured && featuredLabel && (
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Trophy className="text-achievement-rare-glow-strong h-3 w-3" />
            {featuredLabel}
          </span>
        </div>
      )}

      {/* Text overlay */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
        <h3
          className={cn(
            'line-clamp-1 font-semibold text-white drop-shadow-md',
            featured ? 'text-2xl sm:text-3xl' : 'text-base'
          )}
        >
          {game.name}
        </h3>
        <div
          className={cn(
            'mt-0.5 flex items-center gap-1 text-white/80 drop-shadow-md',
            featured ? 'text-sm' : 'text-xs'
          )}
        >
          <Clock className={featured ? 'h-4 w-4' : 'h-3 w-3'} />
          <span>{formatPlaytime(game.playtime)}</span>
        </div>
      </div>
    </PendingLink>
  );
}
