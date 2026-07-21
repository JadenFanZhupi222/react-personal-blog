# Home Media Entry Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the empty, repetitive homepage entry cards with three equal, image-led navigation cards.

**Architecture:** Keep `HomePage` responsible for localized card data and grid layout. Extend `FeatureCard` with a cover image while preserving its current routing and motion behavior. Store three original static covers in `public/images/home/` and render them through `next/image`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Vitest, Next Image

---

### Task 1: Lock the intended card structure with a failing test

**Files:**
- Modify: `src/components/home/homeTypography.test.ts`

- [ ] **Step 1: Replace the current media-card assertions**

Assert that the homepage uses `lg:grid-cols-3`, each card receives a `cover`, and the card component renders `Image`. Assert that the old asymmetric grid and duplicated detail heading are absent:

```ts
expect(homeSource).toContain('lg:grid-cols-3');
expect(homeSource).not.toContain("lg:grid-cols-[1.25fr_1fr_1fr]");
expect(homeSource.match(/cover:/g)).toHaveLength(3);
expect(featureCardSource).toContain("from 'next/image'");
expect(featureCardSource).toContain('src={cover}');
expect(featureCardSource).not.toContain('<h3');
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npx vitest run src/components/home/homeTypography.test.ts`

Expected: FAIL because `cover` and `next/image` are not yet implemented and the asymmetric grid remains.

- [ ] **Step 3: Commit the failing test**

Run:

```bash
git add src/components/home/homeTypography.test.ts
git commit -m "test: define homepage media card layout"
```

### Task 2: Create original cover artwork

**Files:**
- Create: `public/images/home/about-cover.png`
- Create: `public/images/home/projects-cover.png`
- Create: `public/images/home/writing-cover.png`

- [ ] **Step 1: Generate one coherent three-cover visual set**

Generate three separate 16:9 editorial images with the same graphite, warm amber, cream, grain, and hard-light treatment:

- About: developer desk, notebook, portrait-free personal artifacts.
- Projects: code screens, system diagrams, mechanical construction details.
- Writing: marked-up technical pages, keyboard, editorial notes.

Do not include logos, characters, game artwork, readable text, or protected Rockstar assets.

- [ ] **Step 2: Inspect each image**

Confirm each cover is distinct, keeps useful dark space for lower-left text, and remains legible when cropped to 16:9.

- [ ] **Step 3: Add the three assets**

Run:

```bash
git add public/images/home/about-cover.png public/images/home/projects-cover.png public/images/home/writing-cover.png
git commit -m "assets: add homepage entry covers"
```

### Task 3: Implement the equal media-card layout

**Files:**
- Modify: `src/components/home/index.tsx`
- Modify: `src/components/features/FeatureCard/index.tsx`

- [ ] **Step 1: Add cover data in `HomePage`**

Add these exact values to the three card objects:

```ts
cover: '/images/home/about-cover.png'
cover: '/images/home/projects-cover.png'
cover: '/images/home/writing-cover.png'
```

Change the desktop grid to `lg:grid-cols-3` while retaining `md:grid-cols-2`.

- [ ] **Step 2: Add the cover prop and image layer in `FeatureCard`**

Add `cover: string` to `FeatureCardProps`, import `Image` from `next/image`, and render it in the media region:

```tsx
<Image
  src={cover}
  alt=""
  fill
  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
/>
```

Treat the cover as decorative because the visible localized title already names the destination.

- [ ] **Step 3: Remove duplicated content and tighten the footer**

Keep the index and a single title over the cover. Remove the repeated `<h3>` from the footer. Reduce the footer minimum height and retain only the description and CTA. Use the icon as a small corner marker rather than a large yellow square.

- [ ] **Step 4: Run the focused test**

Run: `npx vitest run src/components/home/homeTypography.test.ts`

Expected: 2 tests pass.

- [ ] **Step 5: Commit the component update**

Run:

```bash
git add src/components/home/index.tsx src/components/features/FeatureCard/index.tsx src/components/home/homeTypography.test.ts
git commit -m "style: refine homepage media cards"
```

### Task 4: Verify responsive behavior and production readiness

**Files:**
- Modify only if verification exposes a defect: `src/components/home/index.tsx`
- Modify only if verification exposes a defect: `src/components/features/FeatureCard/index.tsx`

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all tests pass; TypeScript, ESLint, and Next production build exit with code 0.

- [ ] **Step 2: Inspect desktop layout**

Open `http://localhost:3010/zh/home`, confirm three equal columns, one visible title per card, aligned footers, visible focus/hover feedback, and no empty media blocks.

- [ ] **Step 3: Inspect mobile layout**

Set the browser viewport to 390×844 and confirm a single-column layout with no horizontal overflow and readable image-overlay titles.

- [ ] **Step 4: Commit verification fixes if needed**

If browser verification required code changes, run:

```bash
git add src/components/home/index.tsx src/components/features/FeatureCard/index.tsx src/components/home/homeTypography.test.ts
git commit -m "fix: polish homepage media card responsiveness"
```
