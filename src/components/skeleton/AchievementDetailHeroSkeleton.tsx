import React from 'react';

/**
 * Matches the live AchievementDetailPage hero layout: full-bleed aspect
 * box with a title + stats block bottom-left in the max-w-7xl gutter,
 * plus the floating back-link chip top-left. Shown while Steam data
 * resolves so the hero region isn't a blank black void.
 */
export function AchievementDetailHeroSkeleton() {
  return (
    <div className="relative aspect-[1920/620] min-h-[240px] w-full overflow-hidden bg-zinc-900/40">
      {/* image placeholder — full bleed, soft pulse */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800/60 via-zinc-900/40 to-zinc-800/60" />

      {/* scrim layers — match the real ones so the seam to page content
          stays consistent when the real hero swaps in */}
      <div className="absolute inset-0 bg-gradient-to-t from-background from-30% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* back link chip placeholder */}
      <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
        <div className="h-8 w-24 animate-pulse rounded-full bg-black/30 backdrop-blur-md" />
      </div>

      {/* title + stats placeholder in the max-w-7xl gutter */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
          <div className="h-10 w-72 animate-pulse rounded bg-white/15 sm:h-14 sm:w-96 lg:h-16 lg:w-[28rem]" />
          <div className="mt-4 flex items-center gap-3">
            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1 bg-white/10" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1 bg-white/10" />
            <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
