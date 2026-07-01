# Developer Observatory Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the personal blog into a dark-first Developer Observatory with stronger color, global ambience, page-level React Bits-inspired motion, and calmer reading surfaces.

**Architecture:** Keep the current Next.js App Router and component boundaries. Extend the existing `src/components/effects` layer for ambience and motion, then apply the new visual language page by page without changing data contracts. Shared primitives keep accessible focus states, reduced-motion fallbacks, and visible default content.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4 CSS variables, Framer Motion, existing GSAP on achievement overview, Vitest/Testing Library.

---

## File Structure

- Modify `src/app/globals.css`: observatory color tokens, dark/light fallback, background utilities, motion keyframes, reduced-motion rules.
- Modify `src/components/effects/GridAura.tsx`: stronger observatory ambience while preserving `data-effect="grid-aura"`.
- Modify `src/components/effects/PointerGlow.tsx`: align pointer glow with new palette.
- Modify `src/components/layout/Navbar.tsx`: command-bar navigation and active route indicator.
- Modify `src/components/layout/MobileMenu.tsx`: matching mobile command surface.
- Modify `src/components/layout/PageHeader.tsx`: richer page heading treatment.
- Modify `src/components/home/index.tsx`: asymmetric dashboard home.
- Modify `src/components/features/FeatureCard/index.tsx`: observatory module cards.
- Modify `src/components/home/LeetCodeCard/index.tsx`: activity module styling and progress shimmer.
- Modify `src/components/home/SteamCard/index.tsx`: localized amber/Steam signal treatment.
- Modify `src/components/about/index.tsx`, `SkillCard/index.tsx`, `ExperienceCard/index.tsx`: profile scanner and timeline feel.
- Modify `src/components/project/index.tsx`: project inspection wall.
- Modify `src/components/blog/index.tsx`, `detailPage/index.tsx`, `detailPage/FooterNav.tsx`: quiet blog polish.
- Modify `src/components/contact/index.tsx`, `contactCard/index.tsx`: signal channel panels.
- Modify `src/components/achievements/AchievementsOverview/index.tsx`, `GameGridCard/index.tsx`, `AchievementCard/index.tsx`: richer localized game/achievement polish.
- Test `src/components/effects/effects.test.tsx`: preserve reduced-motion and visibility contracts.

## Task 1: Global Observatory System

**Files:**
- Modify `src/app/globals.css`
- Modify `src/components/effects/GridAura.tsx`
- Modify `src/components/effects/PointerGlow.tsx`
- Test `src/components/effects/effects.test.tsx`

- [ ] **Step 1: Run current effect tests**

Run: `pnpm test:run src/components/effects/effects.test.tsx`
Expected: PASS before visual edits.

- [ ] **Step 2: Update theme tokens**

In `src/app/globals.css`, replace the current indigo/pink-dominant tokens with dark-first observatory variables. Keep variable names stable (`--primary`, `--secondary`, `--background`, `--card`, `--border`, etc.) so components continue to compile.

- [ ] **Step 3: Add observatory utilities**

Add classes for `.observatory-shell`, `.observatory-panel`, `.observatory-signal-line`, `.observatory-progress`, and reduced-motion overrides. These classes should use transforms, opacity, background-position, and filter instead of layout animation.

- [ ] **Step 4: Strengthen ambience components**

Update `GridAura` and `PointerGlow` to use observatory class names and preserve existing props and tests. `GridAura` must remain `aria-hidden` and include `data-effect="grid-aura"`.

- [ ] **Step 5: Verify**

Run: `pnpm test:run src/components/effects/effects.test.tsx`
Expected: PASS.

## Task 2: Navigation And Header Surfaces

**Files:**
- Modify `src/components/layout/Navbar.tsx`
- Modify `src/components/layout/MobileMenu.tsx`
- Modify `src/components/layout/PageHeader.tsx`

- [ ] **Step 1: Add active route helpers**

Use the current pathname to mark active desktop links and mobile links. Active links should have `aria-current="page"` where applicable.

- [ ] **Step 2: Restyle Navbar**

Make the navbar a sticky graphite command bar with translucent background, border, active signal dot/underline, and accessible focus-visible styles.

- [ ] **Step 3: Restyle MobileMenu**

Apply the same command surface language to mobile navigation without changing menu state behavior.

- [ ] **Step 4: Upgrade PageHeader**

Give page headers stronger type hierarchy and an optional signal line using only existing `heading` and `text` props.

- [ ] **Step 5: Verify type safety**

Run: `pnpm typecheck`
Expected: PASS or only reveal unrelated existing errors that must be fixed before completion.

## Task 3: Home Dashboard

**Files:**
- Modify `src/components/home/index.tsx`
- Modify `src/components/features/FeatureCard/index.tsx`
- Modify `src/components/home/LeetCodeCard/index.tsx`
- Modify `src/components/home/SteamCard/index.tsx`

- [ ] **Step 1: Redesign Home layout**

Change the home page from centered vertical sections to an asymmetric dashboard: identity panel, feature module grid, and activity modules. Preserve translation usage and route hrefs.

- [ ] **Step 2: Redesign FeatureCard**

Keep `href`, icon, title, description, and action text props. Restyle as observatory modules with magnetic/glare response and visible focus state.

- [ ] **Step 3: Redesign LeetCodeCard**

Keep query behavior and error/loading paths. Add stronger metric hierarchy, observatory progress bars, and shimmer only on progress elements.

- [ ] **Step 4: Redesign SteamCard**

Keep query behavior, profile, recent games, and achievements link. Use amber rarity/signal treatment localized to Steam.

- [ ] **Step 5: Run focused checks**

Run: `pnpm typecheck`
Expected: PASS.

## Task 4: Profile, Projects, Blog, And Contact

**Files:**
- Modify `src/components/about/index.tsx`
- Modify `src/components/about/SkillCard/index.tsx`
- Modify `src/components/about/ExperienceCard/index.tsx`
- Modify `src/components/project/index.tsx`
- Modify `src/components/blog/index.tsx`
- Modify `src/components/blog/detailPage/index.tsx`
- Modify `src/components/blog/detailPage/FooterNav.tsx`
- Modify `src/components/contact/index.tsx`
- Modify `src/components/contact/contactCard/index.tsx`

- [ ] **Step 1: About scanner**

Restyle skills as compact instrument cards and experiences as a readable timeline/log. Preserve data mapping and locale behavior.

- [ ] **Step 2: Project inspection wall**

Convert project cards into stronger slabs with glare, clear external-link affordance, tag shimmer on hover/focus, and readable highlights.

- [ ] **Step 3: Blog list polish**

Improve blog cards for scanning with quieter surfaces, metadata alignment, tag hover states, and stable staggered reveals.

- [ ] **Step 4: Blog detail reading surface**

Improve title, metadata, tags, container, and footer navigation while keeping prose stable and ambience off.

- [ ] **Step 5: Contact channels**

Restyle GitHub, email, and social cards as signal channel panels. Keep links and displayed contact values intact.

- [ ] **Step 6: Verify**

Run: `pnpm typecheck`
Expected: PASS.

## Task 5: Achievements Localized Energy

**Files:**
- Modify `src/components/achievements/AchievementsOverview/index.tsx`
- Modify `src/components/achievements/GameGridCard/index.tsx`
- Modify `src/components/achievements/AchievementCard/index.tsx`
- Modify achievement skeleton files only if the final layout requires matching dimensions.

- [ ] **Step 1: Restyle overview header and controls**

Make the search/sort area feel like command controls with clear focus states and no behavior changes.

- [ ] **Step 2: Strengthen featured game card**

Keep featured logic unchanged. Make the most-played game visually distinct with cover-led hierarchy and glare/depth.

- [ ] **Step 3: Tune achievement cards**

Keep rarity threshold logic. Restrict amber glow to rare achievements and preserve locked/achieved distinctions.

- [ ] **Step 4: Verify**

Run: `pnpm typecheck`
Expected: PASS.

## Task 6: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run tests**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 4: Start dev server**

Run: `pnpm dev`
Expected: local Next.js server starts.

- [ ] **Step 5: Visual inspection**

Inspect `/`, `/en/home`, `/en/about`, `/en/projects`, `/en/blog`, one blog detail page, `/en/contact`, and `/en/achievements` at desktop and mobile widths. Confirm text does not overlap, focus states remain visible, and reduced motion does not leave blank content.

- [ ] **Step 6: Commit**

Run:

```bash
git add src docs/superpowers/plans/2026-07-01-developer-observatory-redesign.md
git commit -m "feat: redesign site as developer observatory"
```

Expected: commit succeeds with only relevant source and plan changes.

## Self-Review

- Spec coverage: global shell, navigation, home, about, projects, blog, contact, achievements, accessibility, performance, and verification all map to tasks.
- Placeholder scan: no TODO/TBD placeholders are used.
- Type consistency: existing component names and prop shapes are preserved unless explicitly listed for modification.
