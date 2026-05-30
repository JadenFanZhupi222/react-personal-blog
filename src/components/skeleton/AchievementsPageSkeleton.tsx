import React from 'react';

/**
 * Matches the live AchievementsOverview layout: max-w-7xl container,
 * page header + summary line, sort/search control bar, then a responsive
 * grid (1 / 2 / 3 / 4 columns) with a featured card spanning 2×2 on lg+.
 */
export function AchievementsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Page title + summary */}
      <div className="mb-3 h-10 w-72 animate-pulse rounded bg-muted/40 sm:h-12" />
      <div className="h-5 w-80 animate-pulse rounded bg-muted/30" />

      {/* Search + sort control bar */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-9 w-full max-w-sm animate-pulse rounded-lg bg-muted/30" />
        <div className="h-9 w-48 animate-pulse rounded-lg bg-muted/30" />
      </div>

      {/* Card grid — same shape as AchievementsOverview's grid: 3 cols
          at lg+ so featured 2×2 + 11 regulars = 5 rows × 3 cols, no gap. */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured card spans 2×2 on lg+ */}
        <div className="bg-muted/20 h-56 animate-pulse rounded-xl lg:col-span-2 lg:row-span-2 lg:h-auto lg:min-h-[26rem]" />

        {/* 11 regular placeholders → fills the page-1 layout exactly */}
        {Array.from({ length: 11 }).map((_, idx) => (
          <div key={idx} className="bg-muted/20 h-56 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}
