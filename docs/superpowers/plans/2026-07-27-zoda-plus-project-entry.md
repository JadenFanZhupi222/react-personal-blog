# Zoda Plus Project Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual Zoda Plus portfolio record, feature it in a four-project homepage carousel, and render dedicated three-terminal artwork.

**Architecture:** Keep Payload CMS as the runtime source of truth. A typed Zoda Plus content module and idempotent Local API command follow the existing Git Client pattern, while the existing project query and order fields continue to drive both the projects page and homepage. The artwork remains a deterministic CSS/SVG React component selected by project slug.

**Tech Stack:** Next.js 16, React 19, TypeScript, Payload CMS 3, Tailwind CSS 4, Vitest

---

## File map

- Create `src/lib/project/zodaPlusProject.ts`: bilingual Zoda Plus content, Payload mapper, and idempotent upsert.
- Create `src/lib/project/zodaPlusProject.test.ts`: content and create/update contract tests.
- Create `scripts/upsert-zoda-plus-project.ts`: executable CMS write and locale/order verification.
- Modify `package.json`: expose the Zoda Plus upsert command.
- Modify `src/lib/project/gitClientProject.ts`: extend the centralized featured order.
- Modify `src/lib/project/gitClientProject.test.ts`: verify the four-project order.
- Modify `src/app/(frontend)/[locale]/home/page.tsx`: select four homepage projects.
- Modify `src/components/home/homeTypography.test.ts`: lock the four-project selection.
- Modify `src/components/home/ProjectArtwork.tsx`: add the dedicated Zoda Plus system artwork.
- Modify `src/components/home/ProjectArtwork.test.tsx`: verify slug-to-artwork selection.

### Task 1: Define and upsert the localized project

**Files:**
- Create: `src/lib/project/zodaPlusProject.ts`
- Create: `src/lib/project/zodaPlusProject.test.ts`
- Create: `scripts/upsert-zoda-plus-project.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing content and upsert tests**

Create tests that require:

```ts
expect(ZODA_PLUS_PROJECT).toMatchObject({
  slug: 'zoda-plus-frontend',
  url: 'https://github.com/gustomedialab/zoda-plus-frontend',
  order: -15,
  tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
});
expect(ZODA_PLUS_PROJECT.locales.en.highlights).toHaveLength(4);
expect(ZODA_PLUS_PROJECT.locales.zh.highlights).toHaveLength(4);
expect(zodaPlusProjectData('zh').tags).toEqual(
  ZODA_PLUS_PROJECT.tags.map((value) => ({ value }))
);
```

Add separate tests proving an existing record is updated in `en` and `zh`, and
a missing record is created once in `en` then updated in `zh`, using the same
minimal Payload test double as `gitClientProject.test.ts`.

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
pnpm test:run -- src/lib/project/zodaPlusProject.test.ts
```

Expected: FAIL because `zodaPlusProject.ts` does not exist.

- [ ] **Step 3: Implement the typed bilingual definition and upsert**

Export:

```ts
export const ZODA_PLUS_PROJECT = {
  slug: 'zoda-plus-frontend',
  url: 'https://github.com/gustomedialab/zoda-plus-frontend',
  order: -15,
  tags: ['Expo', 'React Native', 'Electron', 'TypeScript', 'Turborepo'],
  locales: {
    en: {
      title: 'Zoda Plus',
      description:
        'A cross-platform park photo product connecting an iPad entrance kiosk, a phone web capture flow, and a Windows exit-print terminal in one frontend monorepo.',
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
```

Add `zodaPlusProjectData(locale)` and `upsertZodaPlusProject(payload)` with the
same localized array-field mapping and idempotent create/update sequence used by
the Git Client module.

- [ ] **Step 4: Add and run the CMS command**

Create `scripts/upsert-zoda-plus-project.ts` to:

1. initialize Payload;
2. call `upsertZodaPlusProject` unless `--verify` is supplied;
3. call `applyFeaturedProjectOrder`;
4. query both locales for every slug in `FEATURED_PROJECT_ORDER`;
5. throw if the returned slug sequence differs;
6. destroy Payload in `finally`.

Add:

```json
"cms:upsert:zoda-plus": "tsx --env-file=.env.local scripts/upsert-zoda-plus-project.ts"
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```powershell
pnpm test:run -- src/lib/project/zodaPlusProject.test.ts
```

Expected: all Zoda Plus tests pass.

### Task 2: Expand the selected-project order and homepage limit

**Files:**
- Modify: `src/lib/project/gitClientProject.ts`
- Modify: `src/lib/project/gitClientProject.test.ts`
- Modify: `src/app/(frontend)/[locale]/home/page.tsx`
- Modify: `src/components/home/homeTypography.test.ts`

- [ ] **Step 1: Write failing order and selection tests**

Require:

```ts
expect(FEATURED_PROJECT_ORDER).toEqual([
  { slug: 'ai-photo-booth-desktop', order: -20 },
  { slug: 'zoda-plus-frontend', order: -15 },
  { slug: 'git-client', order: -10 },
  { slug: 'family-meal-planner', order: 1 },
]);
expect(homePageSource).toContain('.slice(0, 4)');
expect(homePageSource).not.toContain('.slice(0, 3)');
```

Rename the home test wording from “three-project showcase” to “four-project
showcase”.

- [ ] **Step 2: Run tests and verify RED**

Run:

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts src/components/home/homeTypography.test.ts
```

Expected: FAIL because the order has two entries and the homepage still slices
three.

- [ ] **Step 3: Implement the order and limit**

Set:

```ts
export const FEATURED_PROJECT_ORDER = [
  { slug: 'ai-photo-booth-desktop', order: -20 },
  { slug: 'zoda-plus-frontend', order: -15 },
  { slug: 'git-client', order: -10 },
  { slug: 'family-meal-planner', order: 1 },
] as const;
```

Change the homepage selection to `.slice(0, 4)`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same focused command and expect every test to pass.

### Task 3: Add dedicated three-terminal artwork

**Files:**
- Modify: `src/components/home/ProjectArtwork.tsx`
- Modify: `src/components/home/ProjectArtwork.test.tsx`

- [ ] **Step 1: Write the failing artwork test**

Add:

```ts
it('renders the three-terminal system artwork for Zoda Plus', () => {
  const artwork = renderToStaticMarkup(
    <ProjectArtwork
      slug="zoda-plus-frontend"
      order={-15}
      title="Zoda Plus"
    />
  );

  expect(artwork).toContain('Three-terminal flow / 01');
  expect(artwork).toContain('ENTRANCE');
  expect(artwork).toContain('PHONE WEB');
  expect(artwork).toContain('EXIT PRINT');
  expect(artwork).not.toContain('Date system / 03');
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
pnpm test:run -- src/components/home/ProjectArtwork.test.tsx
```

Expected: FAIL because Zoda Plus selects the date-system fallback.

- [ ] **Step 3: Implement the dedicated artwork**

Add the slug branch before legacy order fallbacks:

```tsx
if (slug === 'zoda-plus-frontend') {
  return <ZodaPlusArtwork title={title} />;
}
```

Implement `ZodaPlusArtwork` inside the existing `ArtworkFrame`. Render a
connected three-column route with stable labels `ENTRANCE`, `PHONE WEB`, and
`EXIT PRINT`; use a camera aperture for the entrance terminal, an upload arrow
inside a phone frame, a paper tray for the exit terminal, and a small QR grid as
the wristband marker. Use only React markup and existing Tailwind arbitrary
values.

- [ ] **Step 4: Run artwork tests and verify GREEN**

Run the focused artwork test and expect every test to pass.

### Task 4: Write CMS data and run full verification

**Files:**
- Verify all files from Tasks 1–3.

- [ ] **Step 1: Apply the idempotent CMS update**

Run twice:

```powershell
pnpm cms:upsert:zoda-plus
pnpm cms:upsert:zoda-plus
```

Expected: both runs report the same Zoda Plus record ID and the same four-project
order for English and Chinese.

- [ ] **Step 2: Run read-only CMS verification**

Run:

```powershell
pnpm cms:upsert:zoda-plus -- --verify
```

Expected: both locales contain the four expected slugs in order.

- [ ] **Step 3: Run the complete validation set**

Run:

```powershell
pnpm test:run
pnpm typecheck
pnpm lint
pnpm build
```

Expected: every command exits successfully with no test failures, type errors,
lint errors, or production build errors.

- [ ] **Step 4: Inspect the final scope**

Run:

```powershell
git status --short
git diff --check
git diff --stat
```

Expected: only the planned implementation files are modified; existing
untracked tool directories remain untouched.
