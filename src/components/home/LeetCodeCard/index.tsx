'use client';

import { Trophy, Star, Award, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { RefreshButton } from '@/components/ui/RefreshButton';
import { useTranslations } from '@/lib/hooks/useTranslations';
import React from 'react';
import { LeetCodeCardSkeleton } from './Skeleton';
import { ErrorFunc } from '@/components/features/Error';
import { useQuery } from '@tanstack/react-query';
import { leetcodeQueryKey, fetchLeetCodeStats } from '@/lib/queries/leetcode';

export function LeetCodeCard() {
  const { t } = useTranslations();
  const {
    data: stats,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: leetcodeQueryKey,
    queryFn: fetchLeetCodeStats,
  });

  if (isPending) {
    return <LeetCodeCardSkeleton />;
  }

  return (
    <Card className="bg-card text-card-foreground border-border border shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-primary-foreground flex items-center gap-2 text-2xl font-bold">
            <Trophy className="h-5 w-5" />
            {t.home.activity.leetcode.title}
          </h2>
          <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
        </div>
        {error ? (
          <ErrorFunc onRetry={() => refetch()} />
        ) : stats ? (
          <>
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-secondary ml-auto text-3xl font-extrabold">
                  {stats.totalSolved}
                </span>
                <span className="text-muted-foreground text-lg font-semibold">
                  / {stats.totalQuestions}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary-foreground font-medium">
                    {t.home.activity.leetcode.easy}
                  </span>
                  <span className="text-leetcode-easy ml-auto text-sm font-semibold">
                    {stats.easySolved} / {stats.totalEasy}
                  </span>
                </div>
                <div className="bg-muted h-2 w-full rounded">
                  <div
                    className="bg-leetcode-easy h-2 rounded transition-all duration-500"
                    style={{
                      width: `${stats.totalEasy ? (stats.easySolved / stats.totalEasy) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-foreground font-medium">
                    {t.home.activity.leetcode.medium}
                  </span>
                  <span className="text-leetcode-medium ml-auto text-sm font-semibold">
                    {stats.mediumSolved} / {stats.totalMedium}
                  </span>
                </div>
                <div className="bg-muted h-2 w-full rounded">
                  <div
                    className="bg-leetcode-medium h-2 rounded transition-all duration-500"
                    style={{
                      width: `${stats.totalMedium ? (stats.mediumSolved / stats.totalMedium) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-foreground font-medium">
                    {t.home.activity.leetcode.hard}
                  </span>
                  <span className="text-leetcode-hard ml-auto text-sm font-semibold">
                    {stats.hardSolved} / {stats.totalHard}
                  </span>
                </div>
                <div className="bg-muted h-2 w-full rounded">
                  <div
                    className="bg-leetcode-hard h-2 rounded transition-all duration-500"
                    style={{
                      width: `${stats.totalHard ? (stats.hardSolved / stats.totalHard) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <Star className="text-secondary h-4 w-4" />
                  <span className="text-muted-foreground">
                    {t.home.activity.leetcode.completion}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="text-secondary h-4 w-4" />
                  <span className="text-muted-foreground">{t.home.activity.leetcode.ranking}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Medal className="text-secondary h-4 w-4" />
                  <span className="text-muted-foreground">
                    {t.home.activity.leetcode.reputation}
                  </span>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between text-lg font-extrabold">
                <span className="text-foreground">
                  {stats.totalQuestions
                    ? ((stats.totalSolved / stats.totalQuestions) * 100).toFixed(1)
                    : 0}
                  %
                </span>
                <span className="text-foreground">{stats.ranking.toLocaleString()}</span>
                <span className="text-foreground">{stats.reputation}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">{t.home.activity.leetcode.placeholder}</p>
        )}
      </CardContent>
    </Card>
  );
}
