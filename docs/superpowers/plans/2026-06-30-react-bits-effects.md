# React Bits Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable React Bits-inspired developer effects and localized Steam / achievement polish across the personal blog without harming reading comfort.

**Architecture:** Effects live in `src/components/effects/` as small opt-in wrappers. Global ambience is isolated in one client shell, while cards, code blocks, and achievement surfaces opt into focused wrappers. Continuous pointer effects use refs and CSS variables instead of React state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Framer Motion, existing GSAP/OGL where already used, Vitest + Testing Library.

---

## File Structure

- Create: `src/components/effects/usePrefersReducedMotion.ts`
  - Client hook for reduced motion checks.
- Create: `src/components/effects/PointerGlow.tsx`
  - Non-interactive global pointer glow.
- Create: `src/components/effects/GridAura.tsx`
  - Theme-aware grid and beam ambience.
- Create: `src/components/effects/ReactBitsEffects.tsx`
  - Page-aware global effect shell.
- Create: `src/components/effects/MagneticCard.tsx`
  - Pointer-following card wrapper using CSS variables and Framer Motion.
- Create: `src/components/effects/GlareCard.tsx`
  - Spotlight/glare wrapper for project and game cards.
- Create: `src/components/effects/TextReveal.tsx`
  - Accessible text reveal for headings.
- Create: `src/components/effects/AchievementGlow.tsx`
  - Rare achievement glow wrapper.
- Create: `src/components/effects/CodeScanline.tsx`
  - Code block scanline frame.
- Test: `src/components/effects/effects.test.tsx`
  - Verifies visible defaults, reduced-motion behavior, and class contracts.
- Modify: `src/components/layout/AppClientLayout.tsx`
  - Mount global effect shell inside the locale app layout.
- Modify: `src/components/home/index.tsx`
  - Add hero text reveal and ambient surface.
- Modify: `src/components/features/FeatureCard/index.tsx`
  - Wrap feature cards in magnetic/spotlight effects.
- Modify: `src/components/project/index.tsx`
  - Add glare wrapper and tag shimmer.
- Modify: `src/components/features/Markdown/CodeBlock.tsx`
  - Add scanline code frame.
- Modify: `src/components/home/SteamCard/index.tsx`
  - Add localized Steam glow.
- Modify: `src/components/achievements/AchievementCard/index.tsx`
  - Use rare achievement glow wrapper.
- Modify: `src/components/achievements/GameGridCard/index.tsx`
  - Add glare/depth for game cards.
- Modify: `src/app/globals.css`
  - Add keyframes and reduced-motion CSS for shimmer, scanline, aura, and glow.

## Task 1: Write Effect Behavior Tests

**Files:**

- Create: `src/components/effects/effects.test.tsx`

- [ ] **Step 1: Add tests for reduced motion, text reveal, and wrappers**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { TextReveal } from './TextReveal';
import { GridAura } from './GridAura';
import { ReactBitsEffects } from './ReactBitsEffects';
import { AchievementGlow } from './AchievementGlow';
import { CodeScanline } from './CodeScanline';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('React Bits inspired effects', () => {
  test('TextReveal renders readable text by default', () => {
    mockMatchMedia(false);
    render(<TextReveal text="Welcome home" />);
    expect(screen.getByText('Welcome home')).toBeInTheDocument();
  });

  test('GridAura is aria-hidden ambience', () => {
    mockMatchMedia(false);
    const { container } = render(<GridAura />);
    const aura = container.querySelector('[data-effect="grid-aura"]');
    expect(aura).toHaveAttribute('aria-hidden', 'true');
  });

  test('ReactBitsEffects renders no ambience on article detail pages', () => {
    mockMatchMedia(false);
    const { container } = render(<ReactBitsEffects pathname="/en/blog/post-1" />);
    expect(container.querySelector('[data-effect="grid-aura"]')).not.toBeInTheDocument();
  });

  test('AchievementGlow marks rare achieved achievements', () => {
    render(
      <AchievementGlow rare achieved>
        <div>Rare unlock</div>
      </AchievementGlow>
    );
    expect(screen.getByText('Rare unlock').parentElement).toHaveAttribute('data-rare', 'true');
  });

  test('CodeScanline keeps code content visible', () => {
    render(
      <CodeScanline>
        <pre>const value = 1;</pre>
      </CodeScanline>
    );
    expect(screen.getByText('const value = 1;')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test:run src/components/effects/effects.test.tsx`

Expected: FAIL because effect components do not exist yet.

## Task 2: Implement Reusable Effect Components

**Files:**

- Create all files in `src/components/effects/`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Implement minimal components to pass tests**

Create the components listed in File Structure. Keep them prop-driven, accessible, and static-visible before animation runs.

- [ ] **Step 2: Add CSS keyframes and reduced-motion fallbacks**

Add `react-bits-*` keyframes/classes to `globals.css`, with all loops disabled inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 3: Run effect tests and verify GREEN**

Run: `pnpm test:run src/components/effects/effects.test.tsx`

Expected: PASS.

## Task 3: Integrate Global and Home Effects

**Files:**

- Modify: `src/components/layout/AppClientLayout.tsx`
- Modify: `src/components/home/index.tsx`
- Modify: `src/components/features/FeatureCard/index.tsx`
- Modify: `src/components/home/SteamCard/index.tsx`

- [ ] **Step 1: Mount `ReactBitsEffects` in the locale app layout**

Use `usePathname()` in the client layout and pass the current pathname to the shell.

- [ ] **Step 2: Add `TextReveal` to the home page heading**

Replace only the displayed home heading with `TextReveal`; keep subtitle plain and readable.

- [ ] **Step 3: Wrap `FeatureCard` surface with `MagneticCard` and `GlareCard`**

Preserve the existing link, icon, text, and action motion.

- [ ] **Step 4: Add Steam card glow**

Wrap the card in a localized glow class without changing query behavior.

## Task 4: Integrate Project, Blog, and Achievement Effects

**Files:**

- Modify: `src/components/project/index.tsx`
- Modify: `src/components/ui/Badge.tsx`
- Modify: `src/components/features/Markdown/CodeBlock.tsx`
- Modify: `src/components/achievements/AchievementCard/index.tsx`
- Modify: `src/components/achievements/GameGridCard/index.tsx`

- [ ] **Step 1: Add project card glare**

Wrap project cards in `GlareCard` and apply shimmer class to tags.

- [ ] **Step 2: Add optional shimmer support to `Badge`**

Use a class-only approach so existing badges are unchanged unless callers pass a shimmer class.

- [ ] **Step 3: Wrap markdown code blocks in `CodeScanline`**

Keep copy button behavior and code extraction unchanged.

- [ ] **Step 4: Wrap rare achievement cards with `AchievementGlow`**

Use existing `isRare` and `achieved` logic.

- [ ] **Step 5: Add game card glare**

Use `GlareCard` around `PendingLink` content without breaking navigation.

## Task 5: Verify and Commit

**Files:**

- All modified files

- [ ] **Step 1: Run focused tests**

Run: `pnpm test:run src/components/effects/effects.test.tsx`

Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`

Expected: exit code 0.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`

Expected: exit code 0.

- [ ] **Step 4: Run dev server for visual inspection if checks pass**

Run: `pnpm dev`

Inspect `/en/home`, `/en/projects`, `/en/blog`, and `/en/achievements`.

- [ ] **Step 5: Commit implementation**

```bash
git add src/components/effects src/components/layout/AppClientLayout.tsx src/components/home src/components/features/FeatureCard src/components/project src/components/ui/Badge.tsx src/components/features/Markdown/CodeBlock.tsx src/components/achievements src/app/globals.css docs/superpowers/plans/2026-06-30-react-bits-effects.md
git commit -m "feat: add react bits inspired effects"
```

## Self-Review

- Spec coverage: global shell, home, projects, blog code blocks, Steam/achievements, accessibility, and performance all map to tasks.
- Placeholder scan: no TODO/TBD placeholders are used as implementation instructions.
- Type consistency: component names match the proposed file layout and integration steps.
