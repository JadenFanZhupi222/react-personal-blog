# Rockstar-inspired UI Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing personal blog with a graphite, warm-white, and muted-yellow visual system while preserving all routes, content, data, and behavior.

**Architecture:** Change the shared Tailwind theme tokens and global surface utilities first, then simplify shared layout primitives so most pages inherit the refinement. Apply focused page-level changes only where hierarchy or responsive composition cannot be solved by primitives.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, Vitest, Testing Library

---

### Task 1: Lock the shared visual contract

**Files:**

- Modify: `src/app/themeTokens.test.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add failing assertions for the new palette and surfaces**

```ts
expect(css).toContain('--primary: oklch(0.82 0.17 88)');
expect(css).toContain('--background: oklch(0.955 0.012 88)');
expect(css).toContain('--background: oklch(0.105 0.008 85)');
expect(css).toContain('.editorial-panel');
```

- [ ] **Step 2: Verify the contract fails**

Run: `pnpm vitest run src/app/themeTokens.test.ts`
Expected: FAIL because the warm-yellow tokens and editorial surface do not exist.

- [ ] **Step 3: Replace teal theme tokens and simplify global surfaces**

Use a muted warm-yellow primary, warm neutral backgrounds, graphite dark surfaces, single-direction tinted shadows, squared label treatments, and an `editorial-panel` utility with a restrained radius and border. Keep semantic LeetCode, Steam, error, and achievement colors.

- [ ] **Step 4: Verify the theme contract**

Run: `pnpm vitest run src/app/themeTokens.test.ts`
Expected: PASS.

### Task 2: Refine navigation and shared page hierarchy

**Files:**

- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/MobileMenu.tsx`
- Modify: `src/components/layout/PageHeader.tsx`
- Modify: `src/components/ui/Card.tsx`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/Badge.tsx`

- [ ] **Step 1: Replace decorative signal and pill-heavy states**

```tsx
<div className="text-primary mb-5 flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.16em]">
  <span aria-hidden="true" className="bg-primary h-2 w-2" />
  <span>{sectionLabel}</span>
</div>
```

- [ ] **Step 2: Standardize navigation, card, button, badge, focus, hover, and pressed states**

Use 0.5–0.75rem radii, yellow active markers, transform/opacity transitions, visible focus rings, and warm neutral inactive states. Preserve component APIs.

- [ ] **Step 3: Run component and type checks**

Run: `pnpm typecheck && pnpm vitest run src/components/features/ControlPanel/LanguageSwitch.test.ts`
Expected: PASS.

### Task 3: Refine entrance and home composition

**Files:**

- Modify: `src/components/welcome/index.tsx`
- Modify: `src/components/welcome/WelcomeBackdrop.tsx`
- Modify: `src/components/welcome/scenes/HeroScene.tsx`
- Modify: `src/components/welcome/scenes/TechScene.tsx`
- Modify: `src/components/welcome/scenes/ProjectsScene.tsx`
- Modify: `src/components/welcome/scenes/ContactScene.tsx`
- Modify: `src/components/home/index.tsx`
- Modify: `src/components/features/FeatureCard/index.tsx`

- [ ] **Step 1: Preserve the scroll story while reducing decorative competition**

Keep scene order, links, localization, WebGL fallback, and reduced-motion behavior. Replace teal glows with warm yellow, tighten display typography, reduce orbit/beam opacity, and ensure each scene has one dominant focal treatment.

- [ ] **Step 2: Rebalance home into an editorial hero and activity section**

Keep the three feature destinations and both activity data cards. Use an asymmetric feature grid at desktop, restrained stacked layout on mobile, and one hover treatment per interactive card.

- [ ] **Step 3: Run welcome and effects tests**

Run: `pnpm vitest run src/components/welcome src/components/effects`
Expected: PASS.

### Task 4: Refine content pages without changing their data flows

**Files:**

- Modify: `src/components/about/index.tsx`
- Modify: `src/components/about/SkillCard/index.tsx`
- Modify: `src/components/about/ExperienceCard/index.tsx`
- Modify: `src/components/project/index.tsx`
- Modify: `src/components/blog/index.tsx`
- Modify: `src/components/blog/detailPage/index.tsx`
- Modify: `src/components/contact/index.tsx`
- Modify: `src/components/contact/contactCard/index.tsx`
- Modify: `src/components/achievements/AchievementsOverview/index.tsx`

- [ ] **Step 1: Apply the shared page rhythm**

Use consistent max widths, page padding, section spacing, heading scale, metadata density, and divider-based list structures while keeping current data fetching and locale selection unchanged.

- [ ] **Step 2: Keep reading and game-specific semantics intact**

Constrain article prose to a readable measure, quiet article chrome, retain syntax highlighting, and preserve Steam/achievement semantic colors inside neutral shells.

- [ ] **Step 3: Verify parsers and content routes remain valid**

Run: `pnpm vitest run src/lib/about src/lib/blog src/lib/project src/lib/achievements`
Expected: PASS.

### Task 5: Finish secondary states and verify the complete build

**Files:**

- Modify: `src/app/not-found.tsx`
- Modify: `src/app/error.tsx`
- Modify: `src/components/skeleton/*.tsx`

- [ ] **Step 1: Align error, empty, and loading surfaces with the refined system**

Keep existing retry and navigation behavior. Use shape-matched warm-neutral skeletons, direct error copy, and the same shared page shell.

- [ ] **Step 2: Run automated verification**

Run: `pnpm test:run && pnpm typecheck && pnpm lint && pnpm build`
Expected: all commands exit with code 0.

- [ ] **Step 3: Inspect representative routes**

Inspect `/`, `/zh/home`, `/zh/about`, `/zh/projects`, `/zh/blog`, a blog detail route, `/zh/contact`, and `/zh/achievements` at desktop and mobile widths in light and dark themes. Confirm no overflow, clipped focus states, unreadable contrast, broken motion fallback, or layout shift.
