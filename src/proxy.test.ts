import { describe, expect, it } from 'vitest';
import { shouldBypassLocaleProxy } from './proxy';

describe('shouldBypassLocaleProxy', () => {
  it.each(['/admin', '/admin/collections/posts', '/cms-api/posts', '/api/steam', '/rss.xml'])('bypasses %s', (path) => {
    expect(shouldBypassLocaleProxy(path)).toBe(true);
  });

  it.each(['/blog', '/projects', '/zh/blog'])('keeps locale routing active for %s', (path) => {
    expect(shouldBypassLocaleProxy(path)).toBe(false);
  });
});
