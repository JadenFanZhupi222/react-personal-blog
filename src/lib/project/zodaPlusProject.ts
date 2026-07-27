import type { Locale } from '@/i18n/types';

interface LocalizedProjectCopy {
  title: string;
  description: string;
  highlights: string[];
}

interface ZodaPlusProjectDefinition {
  slug: 'zoda-plus-frontend';
  url: string;
  order: number;
  tags: string[];
  locales: Record<Locale, LocalizedProjectCopy>;
}

export const ZODA_PLUS_PROJECT = {
  slug: 'zoda-plus-frontend',
  url: 'https://github.com/gustomedialab/zoda-plus-frontend',
  order: -15,
  tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
  locales: {
    en: {
      title: 'Zoda Plus',
      description:
        'A cross-platform park photo product connecting three terminals in one frontend monorepo: an iPad entrance kiosk, a phone web capture flow, and a Windows exit-print kiosk.',
      highlights: [
        'Shares one Expo and React Native capture flow across the iPad kiosk and phone web while preserving device-specific camera and flash behavior.',
        'Builds the Windows exit kiosk with Electron, QR scanning, a typed print workflow, device gates, and recoverable error states.',
        'Uses pnpm, Turborepo, and shared packages to align API contracts, validation, recipe data, and UI foundations across terminals.',
        'Supports tenant-driven themes and remote assets with bundled fallbacks, Storybook previews, automated checks, and Windows packaging.',
      ],
    },
    zh: {
      title: 'Zoda Plus',
      description:
        '面向园区拍照业务的跨端产品前端，以一个 monorepo 连接入口 iPad 拍照终端、手机 Web 拍照流程与出口 Windows 打印终端。',
      highlights: [
        '通过 Expo 与 React Native 复用 iPad 和手机 Web 的拍照流程，同时保留相机、闪光灯等设备差异。',
        '基于 Electron 构建 Windows 出口终端，覆盖二维码识别、类型化打印流程、设备门禁与可恢复错误状态。',
        '使用 pnpm、Turborepo 和共享包统一多端 API 契约、数据校验、配方配置与 UI 基础能力。',
        '支持租户主题与远程资源、本地逐项回退、Storybook 预览、自动化质量检查和 Windows 打包。',
      ],
    },
  },
} satisfies ZodaPlusProjectDefinition;

export function zodaPlusProjectData(locale: Locale) {
  const copy = ZODA_PLUS_PROJECT.locales[locale];

  return {
    title: copy.title,
    slug: ZODA_PLUS_PROJECT.slug,
    description: copy.description,
    tags: ZODA_PLUS_PROJECT.tags.map((value) => ({ value })),
    highlights: copy.highlights.map((value) => ({ value })),
    url: ZODA_PLUS_PROJECT.url,
    order: ZODA_PLUS_PROJECT.order,
  };
}

type ProjectId = string | number;
type ZodaPlusProjectData = ReturnType<typeof zodaPlusProjectData>;

interface ZodaPlusProjectPayload {
  find(args: {
    collection: 'cms-projects';
    where: { slug: { equals: string } };
    limit: number;
    overrideAccess: true;
  }): Promise<{ docs: Array<{ id: ProjectId }> }>;
  create(args: {
    collection: 'cms-projects';
    locale: Locale;
    data: ZodaPlusProjectData;
    overrideAccess: true;
  }): Promise<{ id: ProjectId }>;
  update(args: {
    collection: 'cms-projects';
    id: ProjectId;
    locale: Locale;
    data: ZodaPlusProjectData;
    overrideAccess: true;
  }): Promise<unknown>;
}

export async function upsertZodaPlusProject(payload: ZodaPlusProjectPayload) {
  const existing = await payload.find({
    collection: 'cms-projects',
    where: { slug: { equals: ZODA_PLUS_PROJECT.slug } },
    limit: 1,
    overrideAccess: true,
  });
  let id = existing.docs[0]?.id;

  for (const locale of ['en', 'zh'] as const) {
    const data = zodaPlusProjectData(locale);
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
