# Home Activity Card Shadow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pale halo around the homepage LeetCode and Steam cards with the approved compact dark shadow.

**Architecture:** Keep the shared `.observatory-panel` style unchanged and add one descendant override scoped to `.home-activity-shell`. A CSS source assertion in the existing theme-token test suite locks the scope and selected shadow values.

**Tech Stack:** CSS, TypeScript, Vitest

---

### Task 1: Scope the compact dark shadow to home activity cards

**Files:**
- Modify: `src/app/themeTokens.test.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing CSS contract test**

Add this test to the existing `describe('theme tokens', ...)` block in
`src/app/themeTokens.test.ts`:

```ts
it('uses a compact dark shadow for observatory panels in the home activity section', () => {
  const activityPanel = cssBlock('.home-activity-shell .observatory-panel');

  expect(activityPanel).toContain(
    'inset 0 1px 0 color-mix(in srgb, var(--foreground) 9%, transparent)'
  );
  expect(activityPanel).toContain('0 8px 18px rgb(0 0 0 / 42%)');
  expect(activityPanel).not.toContain('var(--background)');
});
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run:

```powershell
corepack pnpm vitest run src/app/themeTokens.test.ts
```

Expected: FAIL because `.home-activity-shell .observatory-panel` does not exist yet.

- [ ] **Step 3: Add the minimal scoped shadow override**

Immediately after the existing `.home-activity-shell` block in
`src/app/globals.css`, add:

```css
.home-activity-shell .observatory-panel {
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--foreground) 9%, transparent),
    0 8px 18px rgb(0 0 0 / 42%);
}
```

- [ ] **Step 4: Run focused and full automated verification**

Run:

```powershell
corepack pnpm vitest run src/app/themeTokens.test.ts
corepack pnpm test:run
corepack pnpm typecheck
corepack pnpm lint
```

Expected: all commands pass with no new failures.

- [ ] **Step 5: Verify the rendered section**

Run:

```powershell
corepack pnpm dev
```

Open the homepage in the light theme and confirm:

- the pale halo beneath both cards is gone;
- both cards retain restrained depth against the dark section;
- neither card's spacing, border, content, or responsive layout changed.

- [ ] **Step 6: Commit the implementation**

```powershell
git add -- src/app/themeTokens.test.ts src/app/globals.css
git commit -m "fix: refine home activity card shadows"
```
