# Home Editorial Feature Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the screenshot-overlay homepage entries with a shorter editorial layout that separates media from copy and gives projects and articles distinct proportions.

**Architecture:** Keep `FeatureCard` as the shared semantic link/article component, but split its markup into media and content regions. Use its existing `featured` prop to select the large project treatment or compact article treatment, while the homepage retains the two-to-one desktop grid and database-backed content.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Vitest

---

### Task 1: Define the editorial card contract in tests

**Files:**
- Modify: `src/components/home/homeTypography.test.ts`
- Test: `src/components/home/homeTypography.test.ts`

- [ ] **Step 1: Write the failing structure assertions**

Add these expectations to the featured-content test:

```ts
expect(featureCardSource).toContain('data-slot="feature-media"');
expect(featureCardSource).toContain('data-slot="feature-content"');
expect(featureCardSource).toContain("featured ? 'aspect-[16/8]' : 'aspect-[16/7] lg:aspect-[4/3]'");
expect(featureCardSource).not.toContain('absolute inset-0 flex');
expect(featureCardSource).not.toContain('whileHover={{ y: -4 }}');
```

- [ ] **Step 2: Run the focused test and verify the new contract fails**

Run: `npm test -- src/components/home/homeTypography.test.ts --run`

Expected: FAIL because `FeatureCard` does not yet contain separate feature media/content slots.

- [ ] **Step 3: Commit the test contract**

```powershell
git add -- src/components/home/homeTypography.test.ts
git commit -m "test: define editorial homepage entries"
```

### Task 2: Implement the split media/content card

**Files:**
- Modify: `src/components/features/FeatureCard/index.tsx`
- Test: `src/components/home/homeTypography.test.ts`

- [ ] **Step 1: Add accessible image text to the component contract**

Add `coverAlt` to `FeatureCardProps` and destructuring:

```ts
interface FeatureCardProps {
  href: string;
  cover: string;
  coverAlt: string;
  label: string;
  title: string;
  description: string;
  actionText: string;
  metadata: string;
  featured?: boolean;
}
```

- [ ] **Step 2: Replace the full-card overlay with separate regions**

Use this structure inside the existing link:

```tsx
<motion.article
  className="group overflow-hidden rounded-lg bg-[#0a0a0a] text-white"
  whileTap={{ scale: 0.995 }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
>
  <div
    data-slot="feature-media"
    className={`relative overflow-hidden bg-[#151515] ${
      featured ? 'aspect-[16/8]' : 'aspect-[16/7] lg:aspect-[4/3]'
    }`}
  >
    <Image
      src={cover}
      alt={coverAlt}
      fill
      sizes={featured ? '(max-width: 1023px) 100vw, 67vw' : '(max-width: 1023px) 100vw, 33vw'}
      className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.025]"
    />
    <span className="bg-primary absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-black">
      {label}
    </span>
  </div>
  <div
    data-slot="feature-content"
    className={`flex flex-col ${featured ? 'min-h-64 p-6 sm:p-8' : 'min-h-72 p-6'}`}
  >
    <p className="text-xs font-semibold tracking-[0.08em] text-white/58">{metadata}</p>
    <h3 className={`mt-4 font-black tracking-[-0.04em] text-balance ${featured ? 'max-w-3xl text-4xl leading-[1.02] sm:text-5xl' : 'text-2xl leading-[1.08] sm:text-3xl'}`}>
      {title}
    </h3>
    <p className={`mt-4 max-w-[62ch] leading-7 text-pretty text-white/70 ${featured ? 'line-clamp-2' : 'line-clamp-3'}`}>
      {description}
    </p>
    <p className="group-hover:text-primary mt-auto pt-7 text-sm font-bold transition-colors">
      {actionText} <span aria-hidden="true">→</span>
    </p>
  </div>
</motion.article>
```

- [ ] **Step 3: Run the focused test**

Run: `npm test -- src/components/home/homeTypography.test.ts --run`

Expected: PASS.

- [ ] **Step 4: Commit the component redesign**

```powershell
git add -- src/components/features/FeatureCard/index.tsx src/components/home/homeTypography.test.ts
git commit -m "style: separate homepage media and copy"
```

### Task 3: Tune the homepage composition

**Files:**
- Modify: `src/components/home/index.tsx`
- Test: `src/components/home/homeTypography.test.ts`

- [ ] **Step 1: Pass meaningful image descriptions**

Pass the following props to the project and article entries:

```tsx
coverAlt="个人博客首页的深色界面预览"
```

```tsx
coverAlt="家庭食谱小程序开发文章中的 TypeScript 代码片段"
```

- [ ] **Step 2: Increase separation and align entries to the top**

Change the grid wrapper to:

```tsx
<div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:gap-6">
```

- [ ] **Step 3: Run the focused test and type checker**

Run: `npm test -- src/components/home/homeTypography.test.ts --run`

Expected: PASS.

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 4: Commit the homepage composition**

```powershell
git add -- src/components/home/index.tsx
git commit -m "style: rebalance homepage featured content"
```

### Task 4: Verify production quality

**Files:**
- Verify: `src/components/home/index.tsx`
- Verify: `src/components/features/FeatureCard/index.tsx`
- Verify: `src/components/home/homeTypography.test.ts`

- [ ] **Step 1: Run all automated checks**

```powershell
npm test -- --run
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit with code 0.

- [ ] **Step 2: Inspect desktop layout**

Open `http://localhost:3010/zh/home`, use a 1440 × 900 viewport, and verify:

- the project image and copy are separate;
- the article title does not overlap the code screenshot;
- the section is shorter than the previous 544px matched-card row;
- the project remains visually dominant without forcing equal heights.

- [ ] **Step 3: Inspect mobile layout**

Use a 390 × 844 viewport and verify the entries stack without horizontal overflow, cropped media stays legible, and article copy wraps cleanly.

- [ ] **Step 4: Run the UI detector**

```powershell
node C:\Users\Administrator\.agents\skills\impeccable\scripts\detect.mjs --json src/components/home/index.tsx src/components/features/FeatureCard/index.tsx
```

Expected: no new high-priority design findings.

- [ ] **Step 5: Commit any final optical adjustments**

```powershell
git add -- src/components/home/index.tsx src/components/features/FeatureCard/index.tsx src/components/home/homeTypography.test.ts
git commit -m "style: polish homepage editorial entries"
```
