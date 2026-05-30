import React from 'react';

/**
 * Matches the live AchievementSection layout in AchievementDetailPage:
 * a section heading + count, then a 2-column responsive grid of cards.
 * Rendered twice in the live page (achieved + locked sections); this
 * skeleton renders ONE section worth which is plenty during the brief
 * load window before achievements resolve.
 */
export function AchievementsCardSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 2 }).map((_, sectionIdx) => (
        <section key={sectionIdx}>
          {/* Section header: title + count */}
          <div className="mb-4 flex items-baseline gap-3">
            <div className="h-6 w-24 animate-pulse rounded bg-muted/40" />
            <div className="h-4 w-8 animate-pulse rounded bg-muted/30" />
          </div>

          {/* 2-column achievement card grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex min-h-[88px] animate-pulse items-center gap-4 rounded-lg border border-border bg-muted/10 p-4"
              >
                <div className="h-14 w-14 shrink-0 rounded bg-muted/40" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/5 rounded bg-muted/40" />
                  <div className="h-3 w-4/5 rounded bg-muted/20" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
