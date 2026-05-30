# Welcome Page — Scroll-Story Redesign

**Date:** 2026-05-30
**Status:** Approved for implementation
**Author:** Claude (Opus 4.7) + Jaden

## Summary

Rewrite `src/components/welcome/index.tsx` from a static stack of four
`ParallaxSection` panels into a four-act scroll-driven narrative. Each act
uses a distinct visual register (Editorial / Terminal / Cinematic horizontal /
Editorial close), unified by a lightweight WebGL ambient shader running behind
everything. Built on the official GSAP skills (`gsap-react`,
`gsap-scrolltrigger`, `gsap-performance`) installed in this project.

The current welcome page is functional but generic. The owner wants something
that reads as "designed" rather than "startup template". This redesign treats
the welcome page as a brand moment — a short, cinematic intro before the
`/home` dashboard.

## Goals

- Read as a portfolio-grade design moment, not a generic landing.
- Use the four GSAP styles cohesively (different register per chapter, not
  uniform).
- Stay accessible: honor `prefers-reduced-motion`, gracefully degrade on low-end
  devices.
- Stay SSR-safe under Next.js 16 App Router.
- No regression on bundle size beyond ~35KB gzip.

## Non-Goals

- Not redesigning `/home`, `/about`, `/projects`, `/blog`, or any other route.
- Not migrating existing framer-motion micro-interactions to GSAP — both
  libraries stay, each in its lane (GSAP for scroll story, framer-motion for
  component-level interactions).
- Not adding paid GSAP plugins (SplitText, ScrollSmoother). We replicate split
  reveal with a small `splitChars` helper using `gsap.utils.toArray`.
- Not adding 3D models, only a 2D fragment shader for the ambient layer.

## Architecture

### File layout

```
src/components/welcome/
├── index.tsx               # Orchestrator: mounts AmbientShader + 4 scenes
├── AmbientShader.tsx       # WebGL canvas (dynamic import, ssr:false)
├── scenes/
│   ├── HeroScene.tsx       # Act 1 — Editorial
│   ├── TechScene.tsx       # Act 2 — Terminal
│   ├── ProjectsScene.tsx   # Act 3 — Cinematic horizontal pin
│   └── ContactScene.tsx    # Act 4 — Editorial close
└── lib/
    ├── useReducedMotion.ts # Detects prefers-reduced-motion
    └── splitChars.tsx      # Per-char span splitter (SplitText replacement)
```

### Files removed

- `src/components/ui/ParallaxSection.tsx` (whole file) — only consumer was
  `welcome/index.tsx`. Confirmed via grep before approval.

### Files added

| File | Purpose | Approx LOC |
|---|---|---|
| `welcome/index.tsx` | Orchestrator (replaces existing) | ~30 |
| `welcome/AmbientShader.tsx` | OGL canvas + shader + perf gating | ~120 |
| `welcome/scenes/HeroScene.tsx` | Act 1 | ~80 |
| `welcome/scenes/TechScene.tsx` | Act 2 | ~120 |
| `welcome/scenes/ProjectsScene.tsx` | Act 3 | ~150 |
| `welcome/scenes/ContactScene.tsx` | Act 4 | ~60 |
| `welcome/lib/useReducedMotion.ts` | Hook | ~15 |
| `welcome/lib/splitChars.tsx` | Helper | ~30 |

## Dependencies

### Added

- **`ogl`** (`^1.x`) — ~30KB gzip. WebGL micro-library for the ambient shader.
  Chosen over `three.js` + `@react-three/fiber` (~80KB) because we only need a
  single full-viewport quad with a fragment shader — three is overkill.

### Already in place

- `gsap@^3.13.0` (already installed)
- `@gsap/react@^2.1.2` (installed in prior session)
- `framer-motion@^12.11.0` (kept for micro-interactions outside this redesign)

### Not added

- **SplitText** — Club GreenSock (paid). Replaced by `splitChars` helper.
- **ScrollSmoother** — Club GreenSock (paid). Not needed; native scroll is fine.
- **Lenis** or other smooth-scroll lib — adds complexity, not enough payoff for
  this page.

## Choreography per act

### Act 1 · HERO — Editorial

**Layout:** viewport-height section, name centered, role tags below, Enter CTA
at bottom. Uses Geist Sans (already loaded). White-on-shader-bg.

**Animations:**

- On mount: name letters mask-reveal with `gsap.from(chars, { yPercent: 100,
  stagger: 0.04, ease: 'expo.out' })`. `chars` produced by `splitChars` helper.
- After name finishes: role tags fade-up with stagger 0.08s.
- After role tags: Enter CTA fade-up.
- Scroll out: section is not pinned — natural scroll with a scrub-linked
  `opacity 1 → 0` and `scale 1 → 0.95` on the inner content as the section
  leaves the viewport.

**ScrollTrigger:**

```ts
{
  trigger: sectionRef,
  start: 'top top',
  end: 'bottom top',
  scrub: 0.5,
}
```

### Act 2 · TECH — Terminal

**Layout:** dark background overlay (`bg-zinc-950/95`), CSS grid lines as
overlay, centered code block max-w-2xl. Geist Mono.

**Visual:** the ambient shader stays behind; this scene drops a near-opaque
dark layer on top with a CSS grid pattern.

**Animations:**

- Pinned for ~1.5x viewport height.
- Scroll progress 0 → 1 reveals code character-by-character via scrub. Char
  count derived from progress: `Math.floor(progress * totalChars)`.
- Code content:
  ```ts
  const stack: TechStack = [
    'React 19', 'Next.js 16', 'TypeScript',
    'Node.js', 'Mongo', 'Tailwind v4',
  ];
  // I ship things with them.
  ```
- Token coloring uses existing `--hljs-*` CSS vars (no extra dep). Pre-tokenize
  the string once at module scope into an array of `{ text, className }`.
- Cursor block at the end blinks via CSS keyframe.

**ScrollTrigger:**

```ts
{
  trigger: sectionRef,
  start: 'top top',
  end: '+=150%',  // pin for 1.5x viewport
  pin: true,
  scrub: true,
}
```

### Act 3 · PROJECTS — Cinematic horizontal pin

**Layout:** pinned full-viewport section. Inside, a horizontal `flex` track
holds N project panels, each at `100vw` width.

**Mechanism (per gsap-scrolltrigger skill horizontal scroll pattern):**

- Pin the section.
- Inner track tween: `xPercent: -100 * (N - 1)` with `ease: 'none'` (REQUIRED
  by ScrollTrigger horizontal pattern — non-none ease breaks scroll-to-position
  mapping).
- Vertical scroll length: `end: '+=' + (track.scrollWidth - window.innerWidth)`.

**Per panel:**

- Full-bleed background (gradient placeholder; later: project hero image).
- Title in large display type with `mix-blend-mode: difference` for legibility
  over any image.
- One-line tagline below.
- Subtle inner parallax: bg moves slower than fg by ~20% via
  `containerAnimation` child trigger.

**Number of panels:** ships with current 2 projects from `t.welcome.projects`,
trivially scales.

**ScrollTrigger:**

```ts
const tween = gsap.to(track, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: sectionRef,
    pin: true,
    start: 'top top',
    end: () => '+=' + track.scrollWidth,
    scrub: 1,
  },
});
```

### Act 4 · CONTACT — Editorial close

**Layout:** viewport-height, "Let's talk." in editorial display type centered,
platform buttons in a stagger grid below.

**Animations:**

- On enter: title mask-reveal (reuses `splitChars` from Act 1).
- After title: platform buttons fade-up stagger 0.08s.
- No pin, simple `toggleActions: 'play none none reverse'`.

**ScrollTrigger:**

```ts
{
  trigger: sectionRef,
  start: 'top 70%',
  toggleActions: 'play none none reverse',
}
```

## AmbientShader

### Component contract

- Mounted by `welcome/index.tsx` once, fixed position behind all scenes
  (`position: fixed; inset: 0; z-index: -1`).
- Loaded via `dynamic(() => import('./AmbientShader'), { ssr: false })`.
- Self-contained: no props; reads brand colors from CSS vars via
  `getComputedStyle` once on mount.

### Shader

Single fullscreen quad. Fragment shader does slow value-noise gradient between
three brand-derived colors:

- `--primary` (indigo)
- A muted slate
- A deep dark purple (only in dark theme)

Animation speed ~0.05 (very slow drift).

### Performance gating

The component returns `null` (renders nothing) if **any** of:

1. `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
2. `navigator.hardwareConcurrency < 4`
3. `navigator.deviceMemory < 4` (where supported)

When the document becomes hidden (`visibilitychange`), the requestAnimationFrame
loop is paused; resumed on visible.

### Fallback

When the shader isn't mounted, the orchestrator renders a CSS-only gradient
fallback in the same fixed layer, using brand tokens
(`bg-gradient-to-br from-background via-muted to-background`). The scenes look
intentional instead of visibly broken — just static instead of drifting.

## Cross-cutting concerns

### SSR safety (Next.js 16 / React 19)

- All scenes are `'use client'`.
- `AmbientShader` uses `next/dynamic` with `ssr: false`.
- `gsap.registerPlugin(ScrollTrigger, useGSAP)` runs at module scope — safe
  (registration touches no DOM).
- No `window` / `document` access outside `useGSAP` or `useEffect` callbacks.

### Cleanup

- Every scene uses `useGSAP(() => {...}, { scope: sectionRef })`. Cleanup is
  automatic on unmount. No more `ScrollTrigger.getAll().kill()` global wipe (the
  bug fixed in the prior refactor).

### Reduced motion

Single hook `useReducedMotion()` returns `boolean`. Each scene checks it:

- HERO: skip stagger, render text at final state.
- TECH: render code fully expanded, no scrub.
- PROJECTS: horizontal pin still works (it's content navigation, not
  decoration), but disables inner parallax.
- CONTACT: same as HERO.
- AmbientShader: not mounted.

### Low-end device handling

Same `useReducedMotion` mechanism additionally gates the AmbientShader on
`hardwareConcurrency`/`deviceMemory`. Scroll story itself works on any device
that can run GSAP.

### z-index layering

```
z: -1   AmbientShader (fixed)
z:  0   body background (CSS gradient fallback)
z:  1   scenes (relative, stacked normally)
z: 10   overlays inside scenes (CSS grids, etc.)
```

## Verification

### Compile-time

- `pnpm typecheck` — must pass clean.
- `pnpm lint` — must pass clean.

### Runtime (manual)

1. `pnpm dev`, navigate to `/` (welcome).
2. Slow-scroll through all four acts, confirm each transition is smooth.
3. Scrub fast back and forth — no broken cleanup, no leaked triggers.
4. Test with `prefers-reduced-motion: reduce` (DevTools rendering tab):
   - shader does not mount
   - typing is instant
   - no scrub
5. Throttle CPU 6x in DevTools, confirm FPS stays > 30 on horizontal pin.
6. Lighthouse: CLS unchanged, LCP not regressed by more than 200ms.

### No automated tests

Animation is visual behavior. We rely on typecheck + lint + manual verification.
Adding visual regression tests is out of scope.

## Effort estimate

| Task | Estimate |
|---|---|
| Scaffold dirs + remove ParallaxSection + AmbientShader skeleton | 0.5 d |
| Act 1 HERO | 0.5 d |
| Act 2 TECH | 0.5 d |
| Act 3 PROJECTS (horizontal pin) | 0.75 d |
| Act 4 CONTACT | 0.25 d |
| Reduced-motion / SSR / low-end fallback | 0.5 d |
| Tune + manual verification | 0.5 d |
| **Total** | **~3.5 days** focused work |

## Risks

- **Horizontal pin on small viewports** — pinning fights mobile browsers'
  address-bar collapse. Mitigation: use `start: 'top top'` with `pin: true,
  pinSpacing: true` and `100dvh` instead of `100vh` where possible. Will tune in
  the verification pass.
- **Shader perf on integrated GPUs** — slow noise on a fullscreen quad at 60Hz
  is usually fine, but worst-case mid-tier laptop integrated GPU may dip. The
  hardwareConcurrency gate is a coarse proxy; refine if real issues surface.
- **Layout shift during pin setup** — ScrollTrigger.refresh() runs after fonts
  load. Already auto-handled by GSAP. Confirm during manual verification.
- **Bundle creep** — committing to OGL means we should not also pull in three.js
  later. If a future feature needs three, revisit consolidating.

## Out-of-scope follow-ups

- Replace gradient placeholders in Act 3 with real project hero images
  (separate task — design + asset work).
- Add language switcher placement consideration (currently `ControlPanel`
  floats; needs visual review against the new dark backdrop in Act 2).
- Once shipped, consider applying the `splitChars` / `useReducedMotion`
  utilities to other pages (`/about`, `/contact`) for visual consistency. Not
  part of this work.
