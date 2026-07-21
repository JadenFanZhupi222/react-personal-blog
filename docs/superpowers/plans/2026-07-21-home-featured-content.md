# Home Featured Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic homepage category cards with one real featured project, one real featured article, and an About link in the hero.

**Architecture:** Fetch cached project/blog records in the home server component, pass localized featured records to the client homepage, and render them through a simplified media-card component. Use screenshots captured from the real site as static cover assets.

**Tech Stack:** Next.js 16, React 19, TypeScript, MongoDB/Mongoose, Tailwind CSS 4, Next Image, Vitest

---

### Task 1: Define the target structure in tests

- [ ] Update `src/components/home/homeTypography.test.ts` to require database helpers, a hero About link, a two-column asymmetric grid, and no index/icon scaffolding.
- [ ] Run `npx vitest run src/components/home/homeTypography.test.ts` and confirm the assertions fail for the missing structure.

### Task 2: Capture real covers

- [ ] Capture the live homepage as `public/images/home/personal-blog-project.png`.
- [ ] Capture the family recipe article code as `public/images/home/family-recipe-code.png`.
- [ ] Inspect both at desktop crop and confirm no browser chrome or private information is visible.

### Task 3: Connect cached content data

- [ ] Update `src/app/[locale]/home/page.tsx` to fetch `getAllProjects()` and `getAllBlogs()` server-side.
- [ ] Select the localized personal-homepage project and `taro-family-recipe-summary` article, with stable fallbacks.
- [ ] Pass both records into `HomePage` without exposing database-only fields.

### Task 4: Build the asymmetric editorial layout

- [ ] Simplify `FeatureCard` to cover, metadata, title, description and action text.
- [ ] Remove index and icon props, decorative markers and equal-height category treatment.
- [ ] Add the hero About link and render the project/article grid as `lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]`.
- [ ] Use project tags and article date/read time as meaningful metadata.
- [ ] Remove the three obsolete generated still-life covers.

### Task 5: Verify and merge

- [ ] Run focused tests, full tests, typecheck, lint and production build.
- [ ] Inspect desktop and 390px mobile screenshots with no horizontal overflow.
- [ ] Run the Impeccable detector and address actionable findings.
- [ ] Merge `codex/ui-refinement` into `dev`, rerun tests on `dev`, then remove the feature branch.
