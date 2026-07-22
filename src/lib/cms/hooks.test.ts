import { describe, expect, it } from 'vitest';
import { cacheTagsForSource, isMissingCacheContextError } from './hooks';

describe('cacheTagsForSource', () => {
  it('returns all blog-derived cache tags for posts', () => {
    expect(cacheTagsForSource('posts', { slug: 'hello', tags: ['next', 'cms'] })).toEqual([
      'blogs',
      'blog-slugs',
      'blog-tags',
      'blog-hello-en',
      'blog-hello-zh',
      'blog-context-en-hello',
      'blog-context-zh-hello',
      'blog-tag-next',
      'blog-tag-cms',
    ]);
  });

  it.each([
    ['projects', ['projects']],
    ['experiences', ['about']],
    ['site-settings', ['about', 'contact']],
  ] as const)('maps %s to its public cache tags', (source, expected) => {
    expect(cacheTagsForSource(source)).toEqual(expected);
  });
});

describe('isMissingCacheContextError', () => {
  it('recognizes the Next.js CLI cache-context invariant only', () => {
    expect(isMissingCacheContextError(new Error('Invariant: static generation store missing in revalidateTag blogs'))).toBe(true);
    expect(isMissingCacheContextError(new Error('database offline'))).toBe(false);
  });
});
