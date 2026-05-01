import type { LeetCodeStats, LeetCodeResponse } from '@/lib/leetcode/types';
import { parseLeetCodeStats } from '@/lib/leetcode/parser';
import { leetcodeQuery } from '@/lib/leetcode/queries';

export const LEETCODE_USERNAME = 'Zhupi222';
export const leetcodeQueryKey = ['leetcode'] as const;

export async function fetchLeetCodeStats(): Promise<LeetCodeStats> {
  const res = await fetch('/api/leetcode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: leetcodeQuery,
      variables: { username: LEETCODE_USERNAME },
    }),
  });
  if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`);
  const json = (await res.json()) as { data: LeetCodeResponse };
  return parseLeetCodeStats(json.data);
}
