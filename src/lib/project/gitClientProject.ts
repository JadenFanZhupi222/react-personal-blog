import type { Locale } from '@/i18n/types';

interface LocalizedProjectCopy {
  title: string;
  description: string;
  highlights: string[];
}

interface GitClientProjectDefinition {
  slug: 'git-client';
  url: string;
  order: number;
  tags: string[];
  locales: Record<Locale, LocalizedProjectCopy>;
}

export const GIT_CLIENT_PROJECT: GitClientProjectDefinition = {
  slug: 'git-client',
  url: 'https://github.com/JadenFanZhupi222/git-client',
  order: -10,
  tags: ['Tauri 2', 'Rust', 'React 19', 'TypeScript', 'Git'],
  locales: {
    en: {
      title: 'Strata',
      description:
        'Strata is a cross-platform desktop Git client for everyday development workflows, built with Tauri 2, React 19, and a layered Rust workspace.',
      highlights: [
        'Covers staging, commits, branches, remotes, stash, tags, rebase, reflog, blame, and history search.',
        'Uses a compact, responsive three-pane interface to keep history search, commit details, and diffs readable across window sizes.',
        'Uses layered Rust crates and typed IPC to separate domain logic, Git backends, application services, and desktop adapters.',
        'Includes side-by-side and word-level diffs, syntax highlighting, image diffs, and a three-pane conflict editor, backed by cross-platform CI and desktop E2E coverage.',
      ],
    },
    zh: {
      title: 'Strata',
      description:
        'Strata 是一款面向日常开发工作流的跨平台桌面 Git 客户端，基于 Tauri 2、React 19 和分层 Rust 工作区构建。',
      highlights: [
        '覆盖暂存、提交、分支、远程仓库、Stash、Tag、Rebase、Reflog、Blame 与历史检索。',
        '采用紧凑且响应式的三栏界面，让历史搜索、提交详情与 Diff 在不同窗口尺寸下保持清晰。',
        '通过 Rust 分层 crate 与类型化 IPC 隔离领域逻辑、Git 后端、应用服务和桌面适配层。',
        '支持并排及词级 Diff、语法高亮、图片差异对比和三栏冲突编辑器，并由跨平台 CI 与桌面 E2E 覆盖。',
      ],
    },
  },
};

export function gitClientProjectData(locale: Locale) {
  const copy = GIT_CLIENT_PROJECT.locales[locale];

  return {
    title: copy.title,
    slug: GIT_CLIENT_PROJECT.slug,
    description: copy.description,
    tags: GIT_CLIENT_PROJECT.tags.map((value) => ({ value })),
    highlights: copy.highlights.map((value) => ({ value })),
    url: GIT_CLIENT_PROJECT.url,
    order: GIT_CLIENT_PROJECT.order,
  };
}

type ProjectId = string | number;
type GitClientProjectData = ReturnType<typeof gitClientProjectData>;

export const FEATURED_PROJECT_ORDER = [
  { slug: 'ai-photo-booth-desktop', order: -20 },
  { slug: 'multi-terminal-capture-print-system', order: -15 },
  { slug: 'git-client', order: -10 },
  { slug: 'family-meal-planner', order: 1 },
] as const;

interface FeaturedOrderPayload {
  find(args: {
    collection: 'cms-projects';
    where: { slug: { equals: string } };
    limit: number;
    overrideAccess: true;
  }): Promise<{ docs: Array<{ id: ProjectId }> }>;
  update(args: {
    collection: 'cms-projects';
    id: ProjectId;
    data: { order: number };
    overrideAccess: true;
  }): Promise<unknown>;
}

interface GitClientProjectPayload {
  find(args: {
    collection: 'cms-projects';
    where: { slug: { equals: string } };
    limit: number;
    overrideAccess: true;
  }): Promise<{ docs: Array<{ id: ProjectId }> }>;
  create(args: {
    collection: 'cms-projects';
    locale: Locale;
    data: GitClientProjectData;
    overrideAccess: true;
  }): Promise<{ id: ProjectId }>;
  update(args: {
    collection: 'cms-projects';
    id: ProjectId;
    locale: Locale;
    data: GitClientProjectData;
    overrideAccess: true;
  }): Promise<unknown>;
}

export async function applyFeaturedProjectOrder(payload: FeaturedOrderPayload) {
  for (const project of FEATURED_PROJECT_ORDER) {
    const existing = await payload.find({
      collection: 'cms-projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
      overrideAccess: true,
    });
    const id = existing.docs[0]?.id;

    if (id === undefined) {
      throw new Error(`Missing project: ${project.slug}`);
    }

    await payload.update({
      collection: 'cms-projects',
      id,
      data: { order: project.order },
      overrideAccess: true,
    });
  }
}

export async function upsertGitClientProject(payload: GitClientProjectPayload) {
  const existing = await payload.find({
    collection: 'cms-projects',
    where: { slug: { equals: GIT_CLIENT_PROJECT.slug } },
    limit: 1,
    overrideAccess: true,
  });
  let id = existing.docs[0]?.id;

  for (const locale of ['en', 'zh'] as const) {
    const data = gitClientProjectData(locale);
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
