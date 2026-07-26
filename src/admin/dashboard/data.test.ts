import { describe, expect, it, vi } from 'vitest';
import { loadDashboardData } from './data';

describe('loadDashboardData', () => {
  it('returns counts, drafts, and newest mixed content', async () => {
    const find = vi.fn(async ({ collection }: { collection: string }) => {
      if (collection === 'cms-posts') {
        return {
          totalDocs: 2,
          docs: [
            {
              id: 'p1',
              title: 'Draft post',
              updatedAt: '2026-07-26T10:00:00Z',
              _status: 'draft',
            },
            {
              id: 'p2',
              title: 'Live post',
              updatedAt: '2026-07-25T10:00:00Z',
              _status: 'published',
            },
          ],
        };
      }
      if (collection === 'cms-projects') {
        return {
          totalDocs: 1,
          docs: [{ id: 'j1', title: 'Project', updatedAt: '2026-07-26T11:00:00Z' }],
        };
      }
      if (collection === 'cms-experiences') {
        return {
          totalDocs: 1,
          docs: [{ id: 'e1', title: 'Experience', updatedAt: '2026-07-24T11:00:00Z' }],
        };
      }
      return { totalDocs: 4, docs: [] };
    });

    const result = await loadDashboardData({ find } as never);

    expect(result.metrics).toEqual({
      drafts: 1,
      posts: 2,
      projects: 1,
      experiences: 1,
      media: 4,
    });
    expect(result.recent.map((item) => item.title)).toEqual([
      'Project',
      'Draft post',
      'Live post',
      'Experience',
    ]);
    expect(result.failures).toEqual([]);
  });

  it('preserves successful modules when one collection fails', async () => {
    const find = vi.fn(async ({ collection }: { collection: string }) => {
      if (collection === 'cms-projects') throw new Error('projects unavailable');
      return { totalDocs: 0, docs: [] };
    });

    const result = await loadDashboardData({ find } as never);

    expect(result.metrics.projects).toBeNull();
    expect(result.failures).toContain('projects');
    expect(result.metrics.posts).toBe(0);
  });
});
