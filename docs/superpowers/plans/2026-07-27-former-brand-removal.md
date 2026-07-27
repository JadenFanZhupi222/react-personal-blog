# Former Brand Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the three-terminal portfolio project while removing its former employer brand and repository identity from the current site, CMS, and tracked source tree.

**Architecture:** Replace the branded project module with a neutral `multiTerminalProject` module and migrate the existing CMS record by its unique featured order. Keep the dedicated artwork under neutral component names, make project links optional, and enforce the cleanup with a tracked-source regression scan.

**Tech Stack:** TypeScript, React, Payload CMS, Vitest

---

### Task 1: Replace the project identity and migrate CMS data

**Files:**
- Create: `src/lib/project/multiTerminalProject.ts`
- Create: `src/lib/project/multiTerminalProject.test.ts`
- Create: `scripts/upsert-multi-terminal-project.ts`
- Modify: `src/lib/project/gitClientProject.ts`
- Modify: `src/lib/project/gitClientProject.test.ts`
- Modify: `package.json`
- Delete: the former branded project module, test, and CMS command identified by the restricted-term scan

- [ ] **Step 1: Write failing neutral-project tests**

Create `src/lib/project/multiTerminalProject.test.ts` with assertions for:

```ts
expect(MULTI_TERMINAL_PROJECT).toMatchObject({
  slug: 'multi-terminal-capture-print-system',
  url: '',
  order: -15,
});
expect(multiTerminalProjectData('zh')).toMatchObject({
  title: '多终端拍摄与打印系统',
  slug: 'multi-terminal-capture-print-system',
});
expect(multiTerminalProjectData('en')).toMatchObject({
  title: 'Multi-Terminal Capture & Print System',
});
```

Add a migration test whose mock `find` expects an `or` query containing the
new slug and `{ order: { equals: -15 } }`, then confirm both locale updates use
the same existing ID and write an empty URL.

- [ ] **Step 2: Verify the focused tests fail**

Run:

```powershell
corepack pnpm vitest run src/lib/project/multiTerminalProject.test.ts
```

Expected: FAIL because the neutral project module does not exist.

- [ ] **Step 3: Implement the neutral data module**

Create `src/lib/project/multiTerminalProject.ts` with:

```ts
export const MULTI_TERMINAL_PROJECT = {
  slug: 'multi-terminal-capture-print-system',
  url: '',
  order: -15,
  tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
  locales: {
    en: {
      title: 'Multi-Terminal Capture & Print System',
      description:
        'A cross-platform capture and print system connecting an iPad entrance kiosk, a phone web capture flow, and a Windows exit-print kiosk in one frontend monorepo.',
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
} as const;
```

Implement `multiTerminalProjectData(locale)` and
`upsertMultiTerminalProject(payload)`. The `find` query must be:

```ts
where: {
  or: [
    { slug: { equals: MULTI_TERMINAL_PROJECT.slug } },
    { order: { equals: MULTI_TERMINAL_PROJECT.order } },
  ],
}
```

- [ ] **Step 4: Update ordering and the CMS command**

Change the featured-order entry to:

```ts
{ slug: 'multi-terminal-capture-print-system', order: -15 }
```

Create `scripts/upsert-multi-terminal-project.ts` using the existing command
structure, call `upsertMultiTerminalProject(payload)`, and retain bilingual
order verification. Replace the old package script with:

```json
"cms:upsert:multi-terminal": "tsx --env-file=.env.local scripts/upsert-multi-terminal-project.ts"
```

Delete the superseded branded module, test, and command.

- [ ] **Step 5: Run focused tests**

Run:

```powershell
corepack pnpm vitest run src/lib/project/multiTerminalProject.test.ts src/lib/project/gitClientProject.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the data migration**

```powershell
git add -- package.json scripts src/lib/project
git commit -m "refactor: neutralize multi-terminal project identity"
```

### Task 2: Neutralize artwork and optional project links

**Files:**
- Modify: `src/components/home/ProjectArtwork.tsx`
- Modify: `src/components/home/ProjectArtwork.test.tsx`
- Modify: `src/components/project/index.tsx`
- Create: `src/components/project/ProjectTitleLink.test.tsx`
- Create: `src/components/project/ProjectTitleLink.tsx`

- [ ] **Step 1: Write failing rendering tests**

Update the artwork test to render:

```tsx
<ProjectArtwork
  slug="multi-terminal-capture-print-system"
  title="Multi-Terminal Capture & Print System"
/>
```

Assert the dedicated labels `ENTRANCE`, `PHONE WEB`, and `EXIT PRINT` remain.

Create `ProjectTitleLink.test.tsx` and assert:

```tsx
expect(render(<ProjectTitleLink title="Private project" url="" />).container.querySelector('a'))
  .toBeNull();
expect(screen.queryByTestId('project-external-link')).not.toBeInTheDocument();
```

Also render a public URL and assert the title is linked with the external icon.

- [ ] **Step 2: Verify the focused tests fail**

Run:

```powershell
corepack pnpm vitest run src/components/home/ProjectArtwork.test.tsx src/components/project/ProjectTitleLink.test.tsx
```

Expected: FAIL because the new slug selects the fallback artwork and
`ProjectTitleLink` does not exist.

- [ ] **Step 3: Implement neutral artwork naming**

Change the artwork selection to:

```ts
if (slug === 'multi-terminal-capture-print-system') {
  return <MultiTerminalArtwork title={title} />;
}
```

Rename the dedicated component to `MultiTerminalArtwork`; keep its existing
three-terminal visual composition.

- [ ] **Step 4: Implement optional project links**

Create `ProjectTitleLink.tsx`:

```tsx
export function ProjectTitleLink({ title, url }: { title: string; url: string }) {
  if (!url) {
    return <span>{title}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="inline-flex items-center gap-2">
        {title}
        <ExternalLink
          data-testid="project-external-link"
          className="text-primary h-4 w-4"
        />
      </span>
    </a>
  );
}
```

Use this component from `ProjectListPage`.

- [ ] **Step 5: Run focused tests and commit**

Run:

```powershell
corepack pnpm vitest run src/components/home/ProjectArtwork.test.tsx src/components/project/ProjectTitleLink.test.tsx
```

Expected: PASS.

Then:

```powershell
git add -- src/components/home src/components/project
git commit -m "refactor: remove former branding from project presentation"
```

### Task 3: Remove historical documents from the current tree and add a guard

**Files:**
- Delete: the superseded 2026-07-27 project-entry design and plan returned by the restricted-term scan
- Create: `src/lib/project/formerBrandRemoval.test.ts`

- [ ] **Step 1: Write the tracked-source scan**

Create `src/lib/project/formerBrandRemoval.test.ts`. Build the restricted root
without spelling it contiguously in the source:

```ts
const restrictedRoot = ['zo', 'da'].join('');
const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
  cwd: process.cwd(),
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean)
  .filter((file) => !file.endsWith('formerBrandRemoval.test.ts'));

const matches = trackedFiles.filter((file) => {
  const content = readFileSync(join(process.cwd(), file), 'utf8');
  return content.toLowerCase().includes(restrictedRoot);
});

expect(matches).toEqual([]);
```

- [ ] **Step 2: Verify the scan fails**

Run:

```powershell
corepack pnpm vitest run src/lib/project/formerBrandRemoval.test.ts
```

Expected: FAIL and list the remaining branded files.

- [ ] **Step 3: Delete superseded documents and clear all current-tree matches**

Resolve remaining tracked matches with the same constructed restricted root,
delete the two superseded project-entry documents, and rename or rewrite any
remaining source identifier until the scan returns no files.

- [ ] **Step 4: Run the guard and full verification**

Run:

```powershell
corepack pnpm vitest run src/lib/project/formerBrandRemoval.test.ts
corepack pnpm test:run
corepack pnpm typecheck
corepack pnpm lint
```

Expected: all commands pass.

- [ ] **Step 5: Commit the guard and document cleanup**

```powershell
git add -- docs src/lib/project/formerBrandRemoval.test.ts
git commit -m "test: prevent former brand references"
```

### Task 4: Migrate CMS and verify rendered output

**Files:**
- No additional tracked files expected

- [ ] **Step 1: Run the CMS migration twice**

Copy the ignored `.env.local` into the worktree, then run:

```powershell
corepack pnpm cms:upsert:multi-terminal
corepack pnpm cms:upsert:multi-terminal
corepack pnpm cms:upsert:multi-terminal -- --verify
```

Expected: both writes report the same record ID; verification reports the
neutral slug in second position for both locales.

- [ ] **Step 2: Inspect the rendered homepage and projects page**

Start the local app and verify:

- the homepage carousel shows the neutral title and dedicated artwork;
- its CTA points to the local projects page, not the former repository;
- the projects page shows the neutral title without an external-link icon;
- no visible copy contains the restricted brand.

- [ ] **Step 3: Confirm the branch is ready**

Run:

```powershell
git status --short
git log --oneline --max-count=5
```

Expected: only ignored local setup files remain and all planned commits are
present.
