# React Bits Effects Design

**Date:** 2026-06-30
**Status:** Approved concept, pending written spec review
**Register:** Brand

## Summary

Add a React Bits-inspired effect layer to the personal blog. The direction is developer-showcase first, with a small amount of Steam / achievement energy. The implementation should make the site feel more memorable without turning reading or scanning pages into animation demos.

React Bits will be treated as a component reference source. We will inline focused, local React components that match the site's stack and style instead of adding a broad dependency or copying effects indiscriminately.

## Goals

- Add multiple reusable visual effects that are useful across the blog.
- Make `/` and `/{locale}/home` feel like the strongest visual surfaces.
- Add localized game/achievement glow to Steam and achievement-related UI.
- Keep blog detail pages readable and stable.
- Respect reduced motion and lower-power devices.
- Use existing dependencies where possible: Framer Motion, GSAP, OGL, Tailwind, Radix, and lucide.

## Non-Goals

- No full redesign of routing, information architecture, or copy.
- No heavy new animation runtime unless verification proves it is needed.
- No constant motion on article body text.
- No replacing the existing GSAP welcome scroll story.
- No React Bits effect dump where every component gets the same animation.

## Design Read

Reading this as a personal technical portfolio and blog for people evaluating taste, ability, and personality. The visual language should be dark, precise, kinetic, and developer-native. The Steam layer should feel like a secondary signature: rare glow, progress, and achievement feedback, not full game HUD theming.

Dial values:

- `DESIGN_VARIANCE: 6` because this is a blog/portfolio with room for personality but existing IA should remain familiar.
- `MOTION_INTENSITY: 6` because the welcome page is already cinematic and home can support richer motion.
- `VISUAL_DENSITY: 4` because readers still need calm paths into articles and projects.

## Effect Inventory

### Global Effect Shell

Create a small client-only shell for page-level effects:

- `PointerGlow`: subtle radial glow that follows pointer on pointer-capable devices.
- `GridAura`: low-opacity developer grid / beam background, disabled on article detail if it hurts reading.
- `ReducedMotionProvider` or local hook reuse: centralizes `prefers-reduced-motion` checks.

The shell should render behind content and avoid trapping pointer events.

### Home Page Effects

Enhance `src/components/home/index.tsx` and reusable card components:

- Animated heading treatment similar to React Bits text reveal, but limited to the hero title/subtitle.
- Feature cards receive magnetic hover, spotlight border, and slight lift.
- LeetCode and Steam cards receive staggered reveal and subtle status glow.
- Background gets a restrained beam/grid effect that works in both themes.

### Project Page Effects

Enhance project cards without changing project data shape:

- `GlareCard` style hover using pointer position CSS variables.
- Tech `Badge` shimmer on hover/focus.
- Card entrance remains staggered but should not block content visibility.

### Blog Effects

Keep details restrained:

- Blog list cards may reveal with a small stagger.
- Tags can use hover shimmer.
- Code blocks can get a scanline/titlebar effect and copy feedback polish.
- Article body paragraphs, headings, and tables stay stable.

### Steam / Achievement Effects

Add localized game energy where semantically relevant:

- Rare achievement glow token and pulse.
- Completion progress shimmer only while visible or on hover.
- Achievement cards can use subtle depth and highlight on interaction.

This should not leak into general site chrome.

## Architecture

Proposed file layout:

```text
src/components/effects/
  ReactBitsEffects.tsx
  PointerGlow.tsx
  GridAura.tsx
  MagneticCard.tsx
  GlareCard.tsx
  TextReveal.tsx
  AchievementGlow.tsx
  CodeScanline.tsx
  usePrefersReducedMotion.ts
```

Existing components will opt in locally rather than inheriting all effects globally. The global shell should only provide background/pointer ambience.

## Data Flow

Effects are presentational and should not change server data contracts.

- Page components pass children into effect wrappers.
- Pointer-based effects use CSS variables on the affected element.
- Reduced-motion checks determine whether animations run or render static final states.
- Theme colors come from existing CSS variables in `globals.css`.

## Accessibility

- Default content must be visible before animation runs.
- `prefers-reduced-motion: reduce` disables pointer glow, shimmer loops, card magnetic motion, and scanline movement.
- Keyboard focus states must remain visible on animated cards and badges.
- Hover-only affordances must not hide essential information.
- Background effects need `aria-hidden` and `pointer-events-none`.

## Performance

- Avoid React state for continuous pointer tracking.
- Use CSS variables, Framer Motion motion values, or direct element style updates.
- Do not add WebGL unless a specific effect requires it; the welcome page already owns an OGL shader.
- Gate global ambience on reduced motion and coarse pointers.
- Keep effects tree-shakeable and route-local where possible.

## Verification

Run:

```bash
pnpm typecheck
pnpm lint
```

If the app starts cleanly, run `pnpm dev` and inspect:

1. `/`
2. `/{locale}/home`
3. `/{locale}/projects`
4. `/{locale}/blog`
5. a blog detail page
6. `/{locale}/achievements`

Check desktop and mobile widths, light and dark themes, and reduced motion.

## Risks

- Too many simultaneous effects can reduce perceived quality. Mitigation: opt-in wrappers and page-specific gating.
- Pointer effects can be expensive if implemented with React state. Mitigation: CSS variables and direct refs.
- Blog readability can regress. Mitigation: no animated body text and no busy article background.
- Existing GSAP welcome page can conflict with global effects. Mitigation: keep the global shell minimal on `/` and avoid replacing current scroll choreography.

## Open Implementation Notes

- The exact React Bits components to emulate should be chosen during implementation from current React Bits examples, but only if they map to the inventory above.
- Prefer small local components over installing another dependency.
- If a copied component requires a missing package, either adapt it to existing dependencies or ask before installing.
