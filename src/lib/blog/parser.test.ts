import { describe, it, expect } from 'vitest';
import { parseBlogs } from './parser';
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
