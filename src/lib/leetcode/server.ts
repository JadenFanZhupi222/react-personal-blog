import 'server-only';
import { parseLeetCodeStats } from './parser';
import { leetcodeQuery } from './queries';
import type { LeetCodeStats, LeetCodeResponse } from './types';
import { LEETCODE_USERNAME } from '@/lib/queries/leetcode';

export async function getLeetCodeStats(): Promise<LeetCodeStats> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: leetcodeQuery,
      variables: { username: LEETCODE_USERNAME },
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`);
  const json = (await res.json()) as { data: LeetCodeResponse };
  return parseLeetCodeStats(json.data);
}
