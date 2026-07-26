# Git Client Project Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the existing Git Client as localized Payload project data, feature it on the homepage, and give it relevant artwork.

**Architecture:** Keep Payload as the source of truth. A typed content module defines the stable bilingual record, and an idempotent script upserts both locales through Payload's Local API. Existing project queries and order-based homepage selection consume the record without a new route or parallel data source.

**Tech Stack:** Next.js 16, React 19, TypeScript, Payload CMS 3, MongoDB, Vitest

---

## File map

- Create `src/lib/project/gitClientProject.ts`: localized project content and idempotent Payload upsert.
- Create `src/lib/project/gitClientProject.test.ts`: content, locale, URL, and selection-order contract tests.
- Create `scripts/upsert-git-client-project.ts`: executable CMS write and verification entrypoint.
- Modify `package.json`: add the `cms:upsert:git-client` command.
- Modify `src/components/home/ProjectArtwork.tsx`: select and render Git-specific artwork.
- Modify `src/components/home/ProjectArtwork.test.tsx`: verify the artwork selection.

### Task 1: Define and test the localized project record

**Files:**
- Create: `src/lib/project/gitClientProject.ts`
- Create: `src/lib/project/gitClientProject.test.ts`

- [ ] **Step 1: Write the failing content test**

```ts
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts
```

Expected: FAIL because `gitClientProject.ts` does not exist.

- [ ] **Step 3: Add the typed localized content**

```ts
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
```

- [ ] **Step 4: Run the focused test**

Run:

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the content definition**

```powershell
git add src/lib/project/gitClientProject.ts src/lib/project/gitClientProject.test.ts
git commit -m "feat: define git client portfolio content"
```

### Task 2: Add an idempotent Payload upsert command

**Files:**
- Modify: `src/lib/project/gitClientProject.ts`
- Create: `scripts/upsert-git-client-project.ts`
- Modify: `package.json`
- Test: `src/lib/project/gitClientProject.test.ts`

- [ ] **Step 1: Extend the test with the Payload data-shape contract**

Add a test for an exported `gitClientProjectData(locale)` helper:

```ts
import { GIT_CLIENT_PROJECT, gitClientProjectData } from './gitClientProject';

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
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts
```

Expected: FAIL because `gitClientProjectData` is not exported.

- [ ] **Step 3: Add the mapper and Payload upsert**

Append to `src/lib/project/gitClientProject.ts`:

```ts
import type { Payload } from 'payload';

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

export async function upsertGitClientProject(payload: Payload) {
  const existing = await payload.find({
    collection: 'cms-projects',
    where: { slug: { equals: GIT_CLIENT_PROJECT.slug } },
    limit: 1,
    overrideAccess: true,
  });
  let id = existing.docs[0]?.id;

  for (const locale of ['en', 'zh'] as const) {
    const data = gitClientProjectData(locale);
    if (id) {
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
```

- [ ] **Step 4: Add the executable script**

Create `scripts/upsert-git-client-project.ts`:

```ts
import { getPayload } from 'payload';
import config from '../src/payload.config';
import {
  GIT_CLIENT_PROJECT,
  upsertGitClientProject,
} from '../src/lib/project/gitClientProject';

async function main() {
  const payload = await getPayload({ config });
  try {
    if (!process.argv.includes('--verify')) {
      await upsertGitClientProject(payload);
    }

    for (const locale of ['en', 'zh'] as const) {
      const result = await payload.find({
        collection: 'cms-projects',
        locale,
        fallbackLocale: false,
        where: { slug: { equals: GIT_CLIENT_PROJECT.slug } },
        limit: 1,
        overrideAccess: true,
      });
      const project = result.docs[0];
      if (!project) throw new Error(`Missing ${locale} Git Client project`);
      console.log({
        locale,
        id: project.id,
        slug: project.slug,
        title: project.title,
        order: project.order,
      });
    }
  } finally {
    await payload.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Add this package script:

```json
"cms:upsert:git-client": "tsx --env-file=.env.local scripts/upsert-git-client-project.ts"
```

- [ ] **Step 5: Run unit and type checks**

Run:

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts
pnpm typecheck
```

Expected: both commands pass.

- [ ] **Step 6: Commit the upsert command**

```powershell
git add package.json scripts/upsert-git-client-project.ts src/lib/project/gitClientProject.ts src/lib/project/gitClientProject.test.ts
git commit -m "feat: add git client project upsert"
```

### Task 3: Add Git-specific homepage artwork

**Files:**
- Modify: `src/components/home/ProjectArtwork.tsx`
- Modify: `src/components/home/ProjectArtwork.test.tsx`

- [ ] **Step 1: Write the failing artwork selection test**

Add:

```ts
it('renders repository artwork for the Git Client project', () => {
  const artwork = renderToStaticMarkup(
    <ProjectArtwork slug="git-client" order={-10} title="Git Client" />
  );

  expect(artwork).toContain('Repository graph / 00');
  expect(artwork).toContain('main');
  expect(artwork).not.toContain('Date system / 03');
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```powershell
pnpm test:run -- src/components/home/ProjectArtwork.test.tsx
```

Expected: FAIL because the fallback still renders `Date system / 03`.

- [ ] **Step 3: Add the dedicated artwork branch**

Place this branch before the legacy order checks:

```tsx
if (slug === 'git-client') {
  return <GitClientArtwork title={title} />;
}
```

Add a `GitClientArtwork` component using the existing `ArtworkFrame`. It must render the label `Repository graph / 00`, a compact commit graph with `main` and `feature` labels, and yellow/green/red diff rows. Keep it CSS-only so the project entry requires no additional media asset.

- [ ] **Step 4: Run the focused artwork test**

Run:

```powershell
pnpm test:run -- src/components/home/ProjectArtwork.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit the artwork**

```powershell
git add src/components/home/ProjectArtwork.tsx src/components/home/ProjectArtwork.test.tsx
git commit -m "feat: add git client project artwork"
```

### Task 4: Write and verify the CMS data

**Files:**
- No additional source files.

- [ ] **Step 1: Run the idempotent upsert**

Run:

```powershell
pnpm cms:upsert:git-client
```

Expected: one English and one Chinese verification row with the same document ID, slug `git-client`, and order `-10`.

- [ ] **Step 2: Run it a second time**

Run:

```powershell
pnpm cms:upsert:git-client
```

Expected: the same document ID is reported and no duplicate record is created.

- [ ] **Step 3: Run read-only verification**

Run:

```powershell
pnpm cms:upsert:git-client -- --verify
```

Expected: both locales exist with the same ID and localized titles/descriptions.

### Task 5: Final verification

**Files:**
- Verify all files changed in Tasks 1–3.

- [ ] **Step 1: Run the project test suite**

```powershell
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 2: Run static validation**

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Expected: all commands succeed.

- [ ] **Step 3: Inspect the final diff and CMS result**

```powershell
git status --short
git diff HEAD~3 -- package.json scripts/upsert-git-client-project.ts src/lib/project/gitClientProject.ts src/lib/project/gitClientProject.test.ts src/components/home/ProjectArtwork.tsx src/components/home/ProjectArtwork.test.tsx
pnpm cms:upsert:git-client -- --verify
```

Expected: only the planned project-entry changes appear; both CMS locales verify successfully.
