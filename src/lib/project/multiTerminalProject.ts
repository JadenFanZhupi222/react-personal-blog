import type { Locale } from '@/i18n/types';

interface LocalizedProjectCopy {
  title: string;
  description: string;
  highlights: string[];
}

interface MultiTerminalProjectDefinition {
  slug: 'multi-terminal-capture-print-system';
  url: '';
  order: number;
  tags: string[];
  locales: Record<Locale, LocalizedProjectCopy>;
}

export const MULTI_TERMINAL_PROJECT = {
  slug: 'multi-terminal-capture-print-system',
  url: '',
  order: -15,
  tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
  locales: {
    en: {
      title: 'Multi-Terminal Capture & Print System',
      description:
        'A three-terminal capture and print system connecting an iPad entrance kiosk, a phone web capture flow, and a Windows exit-print kiosk in one frontend monorepo.',
      highlights: [
        'Shares one Expo and React Native capture flow across the iPad kiosk and phone web while preserving device-specific camera and flash behavior.',
        'Builds the Windows exit kiosk with Electron, QR scanning, a typed print workflow, device gates, and recoverable error states.',
        'Uses pnpm, Turborepo, and shared packages to align API contracts, validation, configuration data, and UI foundations across terminals.',
        'Supports configurable themes and remote assets with bundled fallbacks, Storybook previews, automated checks, and Windows packaging.',
      ],
    },
    zh: {
      title: '多终端拍摄与打印系统',
      description:
        '面向线下拍摄与打印流程的跨端前端系统，通过一个 monorepo 连接入口 iPad 拍摄终端、手机 Web 拍摄流程与出口 Windows 打印终端。',
      highlights: [
        '通过 Expo 与 React Native 复用 iPad 和手机 Web 的拍摄流程，同时保留相机、闪光灯等设备差异。',
        '基于 Electron 构建 Windows 出口终端，覆盖二维码识别、类型化打印流程、设备门禁与可恢复错误状态。',
        '使用 pnpm、Turborepo 和共享包统一多端 API 契约、数据校验、配置数据与 UI 基础能力。',
        '支持可配置主题、远程资源、本地回退、Storybook 预览、自动化质量检查和 Windows 打包。',
      ],
    },
  },
} satisfies MultiTerminalProjectDefinition;

export function multiTerminalProjectData(locale: Locale) {
  const copy = MULTI_TERMINAL_PROJECT.locales[locale];

  return {
    title: copy.title,
    slug: MULTI_TERMINAL_PROJECT.slug,
    description: copy.description,
    tags: MULTI_TERMINAL_PROJECT.tags.map((value) => ({ value })),
    highlights: copy.highlights.map((value) => ({ value })),
    url: MULTI_TERMINAL_PROJECT.url,
    order: MULTI_TERMINAL_PROJECT.order,
  };
}

type ProjectId = string | number;
type MultiTerminalProjectData = ReturnType<typeof multiTerminalProjectData>;

interface MultiTerminalProjectPayload {
  find(args: {
    collection: 'cms-projects';
    where: {
      or: [
        { slug: { equals: string } },
        { order: { equals: number } },
      ];
    };
    limit: number;
    overrideAccess: true;
  }): Promise<{ docs: Array<{ id: ProjectId }> }>;
  create(args: {
    collection: 'cms-projects';
    locale: Locale;
    data: MultiTerminalProjectData;
    overrideAccess: true;
  }): Promise<{ id: ProjectId }>;
  update(args: {
    collection: 'cms-projects';
    id: ProjectId;
    locale: Locale;
    data: MultiTerminalProjectData;
    overrideAccess: true;
  }): Promise<unknown>;
}

export async function upsertMultiTerminalProject(
  payload: MultiTerminalProjectPayload
) {
  const existing = await payload.find({
    collection: 'cms-projects',
    where: {
      or: [
        { slug: { equals: MULTI_TERMINAL_PROJECT.slug } },
        { order: { equals: MULTI_TERMINAL_PROJECT.order } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  });
  let id = existing.docs[0]?.id;

  for (const locale of ['en', 'zh'] as const) {
    const data = multiTerminalProjectData(locale);
    if (id !== undefined) {
      await payload.update({
        collection: 'cms-projects',
        id,
        locale,
        data,
        overrideAccess: true,
      });
    } else {
      const created = await payload.create({
        collection: 'cms-projects',
        locale,
        data,
        overrideAccess: true,
      });
      id = created.id;
    }
  }

  return id;
}
