import { describe, expect, it } from 'vitest';
import { GIT_CLIENT_PROJECT } from './gitClientProject';

describe('GIT_CLIENT_PROJECT', () => {
  it('defines a public bilingual portfolio entry selected ahead of existing projects', () => {
    expect(GIT_CLIENT_PROJECT.slug).toBe('git-client');
    expect(GIT_CLIENT_PROJECT.url).toBe(
      'https://github.com/JadenFanZhupi222/git-client'
    );
    expect(GIT_CLIENT_PROJECT.order).toBe(-10);
    expect(GIT_CLIENT_PROJECT.tags).toEqual([
      'Tauri 2',
      'Rust',
      'React 19',
      'TypeScript',
      'Git',
    ]);
    expect(GIT_CLIENT_PROJECT.locales.en.highlights).toHaveLength(4);
    expect(GIT_CLIENT_PROJECT.locales.zh.highlights).toHaveLength(4);
    expect(GIT_CLIENT_PROJECT.locales.en.description).toContain('desktop Git client');
    expect(GIT_CLIENT_PROJECT.locales.zh.description).toContain('桌面 Git 客户端');
  });
});
