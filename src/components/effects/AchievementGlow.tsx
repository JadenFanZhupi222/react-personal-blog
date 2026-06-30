'use client';

import { cn } from '@/lib/utils';

interface AchievementGlowProps {
  children: React.ReactNode;
  rare?: boolean;
  achieved?: boolean;
  className?: string;
}

export function AchievementGlow({
  children,
  rare = false,
  achieved = false,
  className,
}: AchievementGlowProps) {
  return (
    <div
      data-rare={rare ? 'true' : 'false'}
      data-achieved={achieved ? 'true' : 'false'}
      className={cn(
        'react-bits-achievement-glow h-full',
        rare && achieved && 'react-bits-achievement-glow--rare',
        rare && !achieved && 'react-bits-achievement-glow--locked',
        className
      )}
    >
      {children}
    </div>
  );
}
