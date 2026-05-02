import { describe, it, expect } from 'vitest';
import { parseProjects } from './parser';
import type { Project } from './types';

const makeProject = (overrides: Partial<Project> = {}): Project => ({
  title: 'Project',
  description: '',
  tags: [],
  slug: 'p',
  highlights: [],
  language: 'en',
  url: '',
  order: 0,
  ...overrides,
});

describe('parseProjects', () => {
  it('groups by language and sorts each group by order ascending', () => {
    const result = parseProjects([
      makeProject({ slug: 'b-en', language: 'en', order: 2 }),
      makeProject({ slug: 'a-en', language: 'en', order: 1 }),
      makeProject({ slug: 'b-zh', language: 'zh', order: 5 }),
      makeProject({ slug: 'a-zh', language: 'zh', order: 3 }),
    ]);
    expect(result.en.map((p) => p.slug)).toEqual(['a-en', 'b-en']);
    expect(result.zh.map((p) => p.slug)).toEqual(['a-zh', 'b-zh']);
  });

  it('returns empty groups for empty input', () => {
    expect(parseProjects([])).toEqual({ en: [], zh: [] });
  });
});
