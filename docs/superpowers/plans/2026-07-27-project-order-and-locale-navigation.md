# Project Order and Locale Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put AI Photo Booth ahead of Git Client, feature the three strongest projects on the welcome page, and make locale switching bypass stale client route data.

**Architecture:** Keep the current CMS-backed project list and static welcome translation model. Change only the project order values and welcome translation entries. Localized-route language changes use full document navigation so the destination is rendered from current server data instead of a prefetched Next.js client cache entry.

**Tech Stack:** Next.js 16, React 19, TypeScript, Payload CMS 3, Vitest

---

## File map

- Modify `src/components/features/ControlPanel/LanguageSwitch.tsx`: use full navigation for locale-prefixed routes.
- Modify `src/components/features/ControlPanel/LanguageSwitch.test.ts`: lock the fresh-navigation behavior.
- Modify `src/i18n/locales/en.ts`: replace legacy welcome projects.
- Modify `src/i18n/locales/zh.ts`: replace legacy welcome projects.
- Modify `src/lib/translations/server.test.ts`: verify bilingual welcome order.
- Modify `src/lib/project/gitClientProject.ts`: define and apply the featured project order.
- Modify `src/lib/project/gitClientProject.test.ts`: verify the order update contract.
- Modify `scripts/upsert-git-client-project.ts`: apply and verify the shared order.

### Task 1: Make localized language changes server-fresh

**Files:**
- Modify: `src/components/features/ControlPanel/LanguageSwitch.tsx`
- Modify: `src/components/features/ControlPanel/LanguageSwitch.test.ts`

- [ ] **Step 1: Write the failing regression assertion**

Extend the existing source contract:

```ts
it('uses a full navigation for localized routes so prefetched CMS data is not reused', () => {
  expect(languageSwitchSource).toContain('window.location.assign');
  expect(languageSwitchSource).not.toContain('router.push');
});
```

- [ ] **Step 2: Run the focused test**

```powershell
pnpm test:run -- src/components/features/ControlPanel/LanguageSwitch.test.ts
```

Expected: FAIL because the component still contains `router.push`.

- [ ] **Step 3: Implement the minimal navigation change**

Remove `useRouter` and replace:

```ts
router.push(`/${newLocale}${rest}`);
```

with:

```ts
window.location.assign(`/${newLocale}${rest}`);
```

Keep the cookie update and welcome-route behavior unchanged.

- [ ] **Step 4: Run the focused test**

```powershell
pnpm test:run -- src/components/features/ControlPanel/LanguageSwitch.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/features/ControlPanel/LanguageSwitch.tsx src/components/features/ControlPanel/LanguageSwitch.test.ts
git commit -m "fix: refresh data when switching locale"
```

### Task 2: Update the welcome project sequence

**Files:**
- Modify: `src/i18n/locales/en.ts`
- Modify: `src/i18n/locales/zh.ts`
- Modify: `src/lib/translations/server.test.ts`

- [ ] **Step 1: Write failing translation-order tests**

Add:

```ts
expect(translations.welcome.projects.items.map((project) => project.title)).toEqual([
  'AI Photo Booth',
  'Git Client',
  'Family Meal Planner',
]);
```

for English and:

```ts
expect(translations.welcome.projects.items.map((project) => project.title)).toEqual([
  'AI 拍照亭桌面应用',
  'Git Client',
  '家庭食谱小程序',
]);
```

for Chinese.

- [ ] **Step 2: Run the translation test**

```powershell
pnpm test:run -- src/lib/translations/server.test.ts
```

Expected: FAIL with the legacy Personal Blog and Date Picker titles.

- [ ] **Step 3: Replace the welcome entries**

Use these English entries:

```ts
items: [
  {
    title: 'AI Photo Booth',
    description:
      'A configurable desktop system for capture, AI generation, payment, printing, and offline operation.',
  },
  {
    title: 'Git Client',
    description:
      'A cross-platform Git client built with Tauri 2, React 19, and a layered Rust workspace.',
  },
  {
    title: 'Family Meal Planner',
    description:
      'A collaborative WeChat Mini Program for shared recipes, meal planning, and household permissions.',
  },
],
```

Use these Chinese entries:

```ts
items: [
  {
    title: 'AI 拍照亭桌面应用',
    description: '覆盖拍摄、AI 生成、支付、打印与离线运行的可配置桌面系统',
  },
  {
    title: 'Git Client',
    description: '基于 Tauri 2、React 19 与 Rust 分层工作区构建的跨平台 Git 客户端',
  },
  {
    title: '家庭食谱小程序',
    description: '支持家庭共享食谱、菜单规划、协作编辑与权限管理的微信小程序',
  },
],
```

- [ ] **Step 4: Run the translation and welcome tests**

```powershell
pnpm test:run -- src/lib/translations/server.test.ts src/components/welcome
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/i18n/locales/en.ts src/i18n/locales/zh.ts src/lib/translations/server.test.ts
git commit -m "feat: refresh welcome project showcase"
```

### Task 3: Apply the featured CMS order

**Files:**
- Modify: `src/lib/project/gitClientProject.ts`
- Modify: `src/lib/project/gitClientProject.test.ts`
- Modify: `scripts/upsert-git-client-project.ts`

- [ ] **Step 1: Write the failing order test**

Add a test using a small fake Payload client:

```ts
it('places AI Photo Booth before Git Client', async () => {
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
  ).toEqual([-20, -10]);
});
```

- [ ] **Step 2: Run the focused test**

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts
```

Expected: FAIL because `applyFeaturedProjectOrder` does not exist.

- [ ] **Step 3: Add the order definition and updater**

Add:

```ts
export const FEATURED_PROJECT_ORDER = [
  { slug: 'ai-photo-booth-desktop', order: -20 },
  { slug: 'git-client', order: -10 },
] as const;

export async function applyFeaturedProjectOrder(payload: FeaturedOrderPayload) {
  for (const project of FEATURED_PROJECT_ORDER) {
    const existing = await payload.find({
      collection: 'cms-projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
      overrideAccess: true,
    });
    const id = existing.docs[0]?.id;
    if (id === undefined) throw new Error(`Missing project: ${project.slug}`);
    await payload.update({
      collection: 'cms-projects',
      id,
      data: { order: project.order },
      overrideAccess: true,
    });
  }
}
```

Update the executable script to call `applyFeaturedProjectOrder(payload)` after the Git Client upsert and verify the sorted slugs equal:

```ts
['ai-photo-booth-desktop', 'git-client']
```

- [ ] **Step 4: Run unit and type checks**

```powershell
pnpm test:run -- src/lib/project/gitClientProject.test.ts
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/project/gitClientProject.ts src/lib/project/gitClientProject.test.ts scripts/upsert-git-client-project.ts
git commit -m "feat: keep photo booth first in project order"
```

### Task 4: Write data and run full verification

- [ ] **Step 1: Apply the idempotent CMS update**

```powershell
pnpm cms:upsert:git-client
pnpm cms:upsert:git-client
```

Expected: both executions report AI Photo Booth before Git Client with stable record IDs.

- [ ] **Step 2: Verify both locales**

```powershell
pnpm exec tsx --env-file=.env.local scripts/upsert-git-client-project.ts --verify
```

Expected: English and Chinese contain the same two IDs and order values `-20`, `-10`.

- [ ] **Step 3: Run all checks**

```powershell
pnpm test:run
pnpm typecheck
pnpm lint
$env:PAYLOAD_SECRET='build-verification-only-not-production'; pnpm build
```

Expected: all commands pass.

- [ ] **Step 4: Reproduce the navigation flow**

Open `/zh/projects`, switch to English, and verify Git Client is visible without manually refreshing. Then inspect `/` in both languages and verify the welcome project order is AI Photo Booth, Git Client, Family Meal Planner.
