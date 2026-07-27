import { describe, expect, it } from 'vitest';
import {
  MULTI_TERMINAL_PROJECT,
  multiTerminalProjectData,
  upsertMultiTerminalProject,
} from './multiTerminalProject';

describe('MULTI_TERMINAL_PROJECT', () => {
  it('defines a neutral bilingual three-terminal portfolio entry', () => {
    expect(MULTI_TERMINAL_PROJECT).toMatchObject({
      slug: 'multi-terminal-capture-print-system',
      url: '',
      order: -15,
      tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
    });
    expect(MULTI_TERMINAL_PROJECT.locales.en.highlights).toHaveLength(4);
    expect(MULTI_TERMINAL_PROJECT.locales.zh.highlights).toHaveLength(4);
    expect(MULTI_TERMINAL_PROJECT.locales.en.description).toContain(
      'three-terminal'
    );
    expect(MULTI_TERMINAL_PROJECT.locales.zh.description).toContain(
      '跨端前端系统'
    );
  });

  it('maps each locale to Payload array fields without a repository URL', () => {
    const zh = multiTerminalProjectData('zh');
    const en = multiTerminalProjectData('en');

    expect(zh).toMatchObject({
      slug: 'multi-terminal-capture-print-system',
      title: '多终端拍摄与打印系统',
      order: -15,
      url: '',
    });
    expect(en.title).toBe('Multi-Terminal Capture & Print System');
    expect(zh.tags).toEqual(
      MULTI_TERMINAL_PROJECT.tags.map((value) => ({ value }))
    );
    expect(zh.highlights).toEqual(
      MULTI_TERMINAL_PROJECT.locales.zh.highlights.map((value) => ({ value }))
    );
  });

  it('finds the existing featured record and updates both locales in place', async () => {
    const finds: Array<Record<string, unknown>> = [];
    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async (args: Record<string, unknown>) => {
        finds.push(args);
        return { docs: [{ id: 'multi-terminal-project-1' }] };
      },
      create: async () => ({ id: 'unexpected' }),
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return { id: 'multi-terminal-project-1' };
      },
    };

    const id = await upsertMultiTerminalProject(payload);

    expect(id).toBe('multi-terminal-project-1');
    expect(finds[0]).toMatchObject({
      where: {
        or: [
          { slug: { equals: 'multi-terminal-capture-print-system' } },
          { order: { equals: -15 } },
        ],
      },
    });
    expect(updates.map(({ locale }) => locale)).toEqual(['en', 'zh']);
    expect(
      updates.every(
        ({ id: updateId, data }) =>
          updateId === 'multi-terminal-project-1' &&
          (data as { url: string }).url === ''
      )
    ).toBe(true);
  });

  it('creates once and updates the second locale when no record exists', async () => {
    const creates: Array<Record<string, unknown>> = [];
    const updates: Array<Record<string, unknown>> = [];
    const payload = {
      find: async () => ({ docs: [] }),
      create: async (args: Record<string, unknown>) => {
        creates.push(args);
        return { id: 'multi-terminal-project-2' };
      },
      update: async (args: Record<string, unknown>) => {
        updates.push(args);
        return { id: 'multi-terminal-project-2' };
      },
    };

    const id = await upsertMultiTerminalProject(payload);

    expect(id).toBe('multi-terminal-project-2');
    expect(creates).toHaveLength(1);
    expect(creates[0]?.locale).toBe('en');
    expect(updates).toHaveLength(1);
    expect(updates[0]?.locale).toBe('zh');
  });
});
