import { describe, expect, it } from 'vitest';
import {
  ZODA_PLUS_PROJECT,
  upsertZodaPlusProject,
  zodaPlusProjectData,
} from './zodaPlusProject';

describe('ZODA_PLUS_PROJECT', () => {
  it('defines a bilingual three-terminal portfolio entry', () => {
    expect(ZODA_PLUS_PROJECT).toMatchObject({
      slug: 'zoda-plus-frontend',
      url: 'https://github.com/gustomedialab/zoda-plus-frontend',
      order: -15,
      tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
    });
    expect(ZODA_PLUS_PROJECT.locales.en.highlights).toHaveLength(4);
    expect(ZODA_PLUS_PROJECT.locales.zh.highlights).toHaveLength(4);
    expect(ZODA_PLUS_PROJECT.locales.en.description).toContain(
      'three terminals'
    );
    expect(ZODA_PLUS_PROJECT.locales.zh.description).toContain('跨端产品前端');
  });

  it('maps each locale to Payload array fields', () => {
    const zh = zodaPlusProjectData('zh');

    expect(zh).toMatchObject({
      slug: 'zoda-plus-frontend',
      title: 'Zoda Plus',
      order: -15,
      url: 'https://github.com/gustomedialab/zoda-plus-frontend',
    });
    expect(zh.tags).toEqual(
      ZODA_PLUS_PROJECT.tags.map((value) => ({ value }))
    );
    expect(zh.highlights).toEqual(
      ZODA_PLUS_PROJECT.locales.zh.highlights.map((value) => ({ value }))
    );
  });

  it('updates both locales when the project already exists', async () => {
    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async () => ({ docs: [{ id: 'zoda-project-1' }] }),
      create: async () => ({ id: 'unexpected' }),
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return { id: 'zoda-project-1' };
      },
    };

    const id = await upsertZodaPlusProject(payload);

    expect(id).toBe('zoda-project-1');
    expect(updates.map(({ locale }) => locale)).toEqual(['en', 'zh']);
    expect(updates.every(({ id: updateId }) => updateId === 'zoda-project-1')).toBe(
      true
    );
  });

  it('creates once and then updates the second locale when the project is new', async () => {
    const creates: Array<Record<string, unknown>> = [];
    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async () => ({ docs: [] }),
      create: async (args: Record<string, unknown>) => {
        creates.push(args);
        return { id: 'zoda-project-2' };
      },
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return { id: 'zoda-project-2' };
      },
    };

    const id = await upsertZodaPlusProject(payload);

    expect(id).toBe('zoda-project-2');
    expect(creates).toHaveLength(1);
    expect(creates[0]?.locale).toBe('en');
    expect(updates).toHaveLength(1);
    expect(updates[0]?.locale).toBe('zh');
  });
});
