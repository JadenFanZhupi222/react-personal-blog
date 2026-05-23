'use client';

import Image from 'next/image';
import { useTranslations } from '@/lib/hooks/useTranslations';

export interface Achievement {
  name?: string;
  displayName: string;
  description: string;
  achieved: number | boolean;
  unlocktime: number;
  icon: string;
  icongray: string;
  rarity?: number;
}

function formatUnlockTime(unlocktime: number) {
  if (!unlocktime) return '';
  return new Date(unlocktime * 1000).toLocaleDateString();
}

export function AchievementCard({ achievement: ach }: { achievement: Achievement }) {
  const { t } = useTranslations();
  const achieved = !!ach.achieved;
  const isRare = typeof ach.rarity === 'number' && ach.rarity < 10;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
        achieved ? 'bg-card hover:bg-accent/40' : 'bg-muted/30 hover:bg-muted/50'
      }`}
    >
      <div className="relative h-12 w-12 flex-shrink-0">
        <Image
          src={achieved ? ach.icon : ach.icongray}
          alt={ach.displayName}
          fill
          sizes="48px"
          className={`rounded-md object-cover ${
            isRare ? 'ring-achievement-rare-glow ring-2' : ''
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`font-semibold ${
            achieved ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {ach.displayName}
        </div>
        {ach.description && (
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            {ach.description}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {achieved && ach.unlocktime > 0 && (
            <span className="text-achievement-green">
              ✓ {t.achievements.achieved} {formatUnlockTime(ach.unlocktime)}
            </span>
          )}
          {typeof ach.rarity === 'number' && (
            <span
              className={isRare ? 'text-achievement-rare-glow-strong font-semibold' : 'text-muted-foreground'}
            >
              {t.achievements.ownedByPercent.replace('{percent}', ach.rarity.toFixed(1))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
