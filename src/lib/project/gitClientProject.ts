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
      title: 'Git Client',
      description:
        'A cross-platform desktop Git client built for real development workflows with Tauri 2, React 19, and a multi-crate Rust workspace.',
      highlights: [
        'Covers staging, commits, branches, remotes, stash, tags, rebase, reflog, blame, and history search.',
        'Uses layered Rust crates and typed IPC to separate domain logic, Git backends, application services, and desktop adapters.',
        'Includes side-by-side and word-level diffs, syntax highlighting, image diffs, and a three-pane conflict editor.',
        'Hardened with frontend and Rust tests, desktop E2E coverage, cross-platform CI, CSP, and release checks.',
      ],
    },
    zh: {
      title: 'Git Client',
      description:
        '一款面向真实开发工作流的跨平台桌面 Git 客户端，基于 Tauri 2、React 19 与 Rust 多 crate 工作区构建。',
      highlights: [
        '覆盖暂存、提交、分支、远程仓库、Stash、Tag、Rebase、Reflog、Blame 与历史检索。',
        '通过 Rust 分层 crate 与类型化 IPC 隔离领域逻辑、Git 后端、应用服务和桌面适配层。',
        '支持并排及词级 Diff、语法高亮、图片差异对比和三栏冲突编辑器。',
        '具备前端与 Rust 测试、桌面端 E2E、跨平台 CI、CSP 和发布检查。',
      ],
    },
  },
};
