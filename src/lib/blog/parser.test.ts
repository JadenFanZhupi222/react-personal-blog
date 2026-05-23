import { describe, it, expect } from 'vitest';
import { parseBlogs, computeBlogContext, collectTags } from './parser';
import type { Blog } from './types';

const makeBlog = (overrides: Partial<Blog> = {}): Blog => ({
  slug: 'hello',
  date: '2026-01-01',
  readTime: '3 min',
  tags: [],
  language: 'en',
  title: 'Hello',
  description: '',
  content: '',
  ...overrides,
});

describe('parseBlogs', () => {
  it('groups blogs by language', () => {
    const result = parseBlogs([
      makeBlog({ slug: 'a', language: 'en' }),
      makeBlog({ slug: 'b', language: 'zh' }),
      makeBlog({ slug: 'c', language: 'en' }),
    ]);
    expect(result.en.map((b) => b.slug)).toEqual(['a', 'c']);
    expect(result.zh.map((b) => b.slug)).toEqual(['b']);
  });

  it('returns empty arrays for both locales when input is empty', () => {
    expect(parseBlogs([])).toEqual({ en: [], zh: [] });
  });

  it('ignores blogs with unknown languages', () => {
    const result = parseBlogs([
      makeBlog({ slug: 'a', language: 'en' }),
      makeBlog({ slug: 'x', language: 'fr' }),
    ]);
    expect(result.en).toHaveLength(1);
    expect(result.zh).toHaveLength(0);
  });
});

describe('computeBlogContext', () => {
  // Newest-first ordering, matching the Mongo query in server.ts
  const blogs: Blog[] = [
    makeBlog({ slug: 'newest', date: '2026-03-01', tags: ['react', 'ts'] }),
    makeBlog({ slug: 'middle', date: '2026-02-01', tags: ['react'] }),
    makeBlog({ slug: 'oldest', date: '2026-01-01', tags: ['ts', 'go'] }),
  ];

  it('picks next as the chronologically newer post and prev as the older one', () => {
    const ctx = computeBlogContext('middle', blogs);
    expect(ctx.next?.slug).toBe('newest');
    expect(ctx.prev?.slug).toBe('oldest');
  });

  it('returns null on the boundaries', () => {
    expect(computeBlogContext('newest', blogs).next).toBeNull();
    expect(computeBlogContext('oldest', blogs).prev).toBeNull();
  });

  it('returns empty context when slug is not found', () => {
    expect(computeBlogContext('missing', blogs)).toEqual({
      prev: null,
      next: null,
      related: [],
    });
  });

  it('ranks related posts by overlapping tag count', () => {
    const ctx = computeBlogContext('newest', blogs, 5);
    // middle shares 1 tag (react), oldest shares 1 tag (ts) — both included
    expect(ctx.related.map((r) => r.slug)).toEqual(expect.arrayContaining(['middle', 'oldest']));
    expect(ctx.related).toHaveLength(2);
  });

  it('excludes the current post from related', () => {
    const ctx = computeBlogContext('newest', blogs);
    expect(ctx.related.find((r) => r.slug === 'newest')).toBeUndefined();
  });
});

describe('collectTags', () => {
  it('counts tag occurrences and sorts by count then alphabetically', () => {
    const result = collectTags([
      makeBlog({ slug: 'a', tags: ['react', 'ts'] }),
      makeBlog({ slug: 'b', tags: ['react'] }),
      makeBlog({ slug: 'c', tags: ['ts', 'go'] }),
    ]);
    expect(result).toEqual([
      { tag: 'react', count: 2 },
      { tag: 'ts', count: 2 },
      { tag: 'go', count: 1 },
    ]);
  });

  it('handles blogs with no tags', () => {
    expect(collectTags([makeBlog({ tags: [] })])).toEqual([]);
  });
});
