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
      className="group relative block aspect-[460/215] overflow-hidden rounded-xl ring-0 ring-primary/40 transition-shadow duration-300 hover:ring-2 hover:shadow-2xl"
    >
      {/* Artwork — fills the card edge-to-edge */}
      <Image
        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
        alt={game.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient scrim only at the bottom so the artwork breathes */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

      {/* Text overlay */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
        <h3 className="line-clamp-1 text-base font-semibold text-white drop-shadow-md">
          {game.name}
        </h3>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-white/80 drop-shadow-md">
          <Clock className="h-3 w-3" />
          <span>{formatPlaytime(game.playtime)}</span>
        </div>
      </div>
    </PendingLink>
  );
}
