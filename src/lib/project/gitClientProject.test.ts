import { describe, expect, it } from 'vitest';
import {
  applyFeaturedProjectOrder,
  FEATURED_PROJECT_ORDER,
  GIT_CLIENT_PROJECT,
  gitClientProjectData,
  upsertGitClientProject,
} from './gitClientProject';

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

  it('maps each locale to Payload array fields', () => {
    const zh = gitClientProjectData('zh');

    expect(zh).toMatchObject({
      slug: 'git-client',
      title: 'Git Client',
      order: -10,
      url: 'https://github.com/JadenFanZhupi222/git-client',
    });
    expect(zh.tags).toEqual(GIT_CLIENT_PROJECT.tags.map((value) => ({ value })));
    expect(zh.highlights).toEqual(
      GIT_CLIENT_PROJECT.locales.zh.highlights.map((value) => ({ value }))
    );
  });

  it('updates both locales when the project already exists', async () => {
    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async () => ({ docs: [{ id: 'project-1' }] }),
      create: async () => ({ id: 'unexpected' }),
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return { id: 'project-1' };
      },
    };

    const id = await upsertGitClientProject(payload);

    expect(id).toBe('project-1');
    expect(updates.map(({ locale }) => locale)).toEqual(['en', 'zh']);
    expect(updates.every(({ id: updateId }) => updateId === 'project-1')).toBe(true);
  });

  it('creates once and then updates the second locale when the project is new', async () => {
    const creates: Array<Record<string, unknown>> = [];
    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async () => ({ docs: [] }),
      create: async (args: Record<string, unknown>) => {
        creates.push(args);
        return { id: 'project-2' };
      },
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return { id: 'project-2' };
      },
    };

    const id = await upsertGitClientProject(payload);

    expect(id).toBe('project-2');
    expect(creates).toHaveLength(1);
    expect(creates[0]?.locale).toBe('en');
    expect(updates).toHaveLength(1);
    expect(updates[0]?.locale).toBe('zh');
  });

  it('applies the four-project featured order', async () => {
    expect(FEATURED_PROJECT_ORDER).toEqual([
      { slug: 'ai-photo-booth-desktop', order: -20 },
      { slug: 'zoda-plus-frontend', order: -15 },
      { slug: 'git-client', order: -10 },
      { slug: 'family-meal-planner', order: 1 },
    ]);

    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async ({ where }: { where: { slug: { equals: string } } }) => ({
        docs: [{ id: `${where.slug.equals}-id` }],
      }),
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return args;
      },
    };

    await applyFeaturedProjectOrder(payload);

    expect(
      updates.map(({ data }) => (data as { order: number }).order)
    ).toEqual([-20, -15, -10, 1]);
  });
});
