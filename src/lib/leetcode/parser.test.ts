import { describe, it, expect } from 'vitest';
import { parseLeetCodeStats } from './parser';
import type { LeetCodeResponse } from './types';

const makeResponse = (overrides: Partial<LeetCodeResponse> = {}): LeetCodeResponse => ({
  matchedUser: {
    submitStats: {
      acSubmissionNum: [
        { difficulty: 'Easy', count: 10 },
        { difficulty: 'Medium', count: 20 },
        { difficulty: 'Hard', count: 5 },
      ],
      totalSubmissionNum: [],
    },
    profile: { ranking: 12345, reputation: 7, starRating: 4 },
  },
  allQuestionsCount: [
    { difficulty: 'Easy', count: 100 },
    { difficulty: 'Medium', count: 200 },
    { difficulty: 'Hard', count: 100 },
  ],
  ...overrides,
});

describe('parseLeetCodeStats', () => {
  it('aggregates totals and computes acceptance rate', () => {
    const stats = parseLeetCodeStats(makeResponse());
    expect(stats.easySolved).toBe(10);
    expect(stats.mediumSolved).toBe(20);
    expect(stats.hardSolved).toBe(5);
    expect(stats.totalSolved).toBe(35);
    expect(stats.totalQuestions).toBe(400);
    expect(stats.acceptanceRate).toBeCloseTo((35 / 400) * 100);
  });

  it('maps profile fields onto stats', () => {
    const stats = parseLeetCodeStats(makeResponse());
    expect(stats.ranking).toBe(12345);
    expect(stats.contributionPoints).toBe(4);
    expect(stats.reputation).toBe(7);
  });

  it('returns 0 acceptance rate when nothing is solved', () => {
    const stats = parseLeetCodeStats(
      makeResponse({
        matchedUser: {
          submitStats: { acSubmissionNum: [], totalSubmissionNum: [] },
          profile: { ranking: 0, reputation: 0, starRating: 0 },
        },
      })
    );
    expect(stats.totalSolved).toBe(0);
    expect(stats.acceptanceRate).toBe(0);
  });

  it('treats missing difficulty buckets as zero', () => {
    const stats = parseLeetCodeStats(
      makeResponse({
        matchedUser: {
          submitStats: {
            acSubmissionNum: [{ difficulty: 'Easy', count: 4 }],
            totalSubmissionNum: [],
          },
          profile: { ranking: 1, reputation: 0, starRating: 0 },
        },
      })
    );
    expect(stats.mediumSolved).toBe(0);
    expect(stats.hardSolved).toBe(0);
    expect(stats.totalSolved).toBe(4);
  });
});
