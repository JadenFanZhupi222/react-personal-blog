'use client';

import Image from 'next/image';
import { CalendarCheck, Sparkles } from 'lucide-react';
import { AchievementGlow } from '@/components/effects/AchievementGlow';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { cn } from '@/lib/utils';

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

const RARE_THRESHOLD = 10;

function formatUnlockTime(unlocktime: number, locale: string) {
  if (!unlocktime) return '';
  return new Date(unlocktime * 1000).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AchievementCard({ achievement: ach }: { achievement: Achievement }) {
  const { locale } = useTranslations();
  const achieved = !!ach.achieved;
  const hasRarity = typeof ach.rarity === 'number';
  const isRare = hasRarity && (ach.rarity as number) < RARE_THRESHOLD;

  return (
    <AchievementGlow rare={isRare} achieved={achieved}>
      <div
        className={cn(
          'group flex h-full items-start gap-3 rounded-xl p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
          achieved ? 'bg-card hover:bg-accent/40' : 'bg-muted/20 opacity-70 hover:opacity-100',
          isRare &&
            achieved &&
            'ring-achievement-rare-glow shadow-[0_0_16px_-2px_var(--achievement-rare-glow)] ring-1',
          isRare && !achieved && 'ring-achievement-rare-glow/40 ring-1'
        )}
      >
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            src={achieved ? ach.icon : ach.icongray}
            alt={ach.displayName}
            fill
            sizes="48px"
            className="rounded-lg object-cover"
          />
        </div>
        {/* Vertical flex so the meta row can be pushed to the bottom — keeps
          cards in the same row visually aligned even when descriptions vary. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className={cn(
              'leading-tight font-semibold',
              achieved ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {ach.displayName}
          </div>
          {ach.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
              {ach.description}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
            {achieved && ach.unlocktime > 0 && (
              <span className="text-achievement-green inline-flex items-center gap-1 tabular-nums">
                <CalendarCheck className="h-3 w-3" />
                {formatUnlockTime(ach.unlocktime, locale)}
              </span>
            )}
            {hasRarity && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 tabular-nums',
                  isRare
                    ? 'text-achievement-rare-glow-strong font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                <Sparkles className="h-3 w-3" />
                {(ach.rarity as number).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </AchievementGlow>
  );
}
