# Welcome Scroll-Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `src/components/welcome/` into a four-act GSAP scroll-story (Editorial Hero → Terminal Tech → Cinematic horizontal Projects → Editorial Contact) with a WebGL ambient shader behind everything.

**Architecture:** Four scene components orchestrated by `welcome/index.tsx`. Each scene owns its own `useGSAP` scoped to a section ref (so cleanup is automatic). A single `AmbientShader` runs as a fixed background layer, dynamic-imported with `ssr:false`. Pure logic helpers (`splitChars`, `useReducedMotion`) get TDD; visual scenes get manual dev-server verification per spec.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, GSAP 3.13, `@gsap/react`, `ogl` (new), framer-motion (kept untouched for micro-interactions).

**Spec:** `docs/superpowers/specs/2026-05-30-welcome-scroll-story-design.md`

---

## File Map

**Create:**
- `src/components/welcome/AmbientShader.tsx` — WebGL canvas, perf gating
- `src/components/welcome/scenes/HeroScene.tsx` — Act 1
- `src/components/welcome/scenes/TechScene.tsx` — Act 2
- `src/components/welcome/scenes/ProjectsScene.tsx` — Act 3
- `src/components/welcome/scenes/ContactScene.tsx` — Act 4
- `src/components/welcome/lib/useReducedMotion.ts` — hook
- `src/components/welcome/lib/useReducedMotion.test.ts` — hook tests
- `src/components/welcome/lib/splitChars.tsx` — helper
- `src/components/welcome/lib/splitChars.test.tsx` — helper tests

**Modify:**
- `src/components/welcome/index.tsx` — replace body, become orchestrator
- `package.json` / `pnpm-lock.yaml` — add `ogl`

**Delete:**
- `src/components/ui/ParallaxSection.tsx` — only consumer was welcome (verified)

---

## Task 0: Branch + dependencies

**Files:** none (git + package manager only)

- [ ] **Step 1: Create feature branch from current HEAD (carries uncommitted welcome work over)**

Run:
```bash
git status                                    # confirm welcome + spec changes only
git checkout -b feature/welcome-scroll-story
```
Expected: new branch created, working tree unchanged (uncommitted changes carry over).

- [ ] **Step 2: Install ogl**

Run:
```bash
pnpm add ogl
```
Expected: `ogl` added to `dependencies` in `package.json`, lockfile updated.

- [ ] **Step 3: Verify baseline still clean**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass with no output.

- [ ] **Step 4: Commit foundation**

```bash
git add package.json pnpm-lock.yaml \
  src/components/ui/ParallaxSection.tsx \
  src/components/welcome/index.tsx \
  docs/superpowers/specs/2026-05-30-welcome-scroll-story-design.md \
  docs/superpowers/plans/2026-05-30-welcome-scroll-story.md
git commit -m "feat(welcome): foundation — @gsap/react + ogl, ParallaxSection refactor, design spec"
```

---

## Task 1: `splitChars` helper (TDD)

**Files:**
- Create: `src/components/welcome/lib/splitChars.tsx`
- Create: `src/components/welcome/lib/splitChars.test.tsx`

Purpose: take a string and return an array of React elements, each char wrapped in a `<span>` so GSAP can stagger over them. Whitespace preserved as non-breaking.

- [ ] **Step 1: Write the failing test**

Create `src/components/welcome/lib/splitChars.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { splitChars } from './splitChars';

describe('splitChars', () => {
  it('wraps each non-space character in a span', () => {
    const { container } = render(<>{splitChars('abc')}</>);
    const spans = container.querySelectorAll('span[data-char]');
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe('a');
    expect(spans[2].textContent).toBe('c');
  });

  it('preserves spaces as non-breaking', () => {
    const { container } = render(<>{splitChars('a b')}</>);
    const spans = container.querySelectorAll('span[data-char]');
    expect(spans).toHaveLength(3);
    expect(spans[1].textContent).toBe(' ');
  });

  it('marks every span with inline-block for GSAP transform safety', () => {
    const { container } = render(<>{splitChars('hi')}</>);
    const span = container.querySelector('span[data-char]') as HTMLElement;
    expect(span.style.display).toBe('inline-block');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
pnpm vitest run src/components/welcome/lib/splitChars.test.tsx
```
Expected: FAIL with "Cannot find module './splitChars'".

- [ ] **Step 3: Implement `splitChars`**

Create `src/components/welcome/lib/splitChars.tsx`:
```tsx
import { Fragment } from 'react';

export function splitChars(text: string) {
  return Array.from(text).map((char, i) => (
    <Fragment key={i}>
      <span
        data-char
        style={{ display: 'inline-block', willChange: 'transform' }}
      >
        {char === ' ' ? ' ' : char}
      </span>
    </Fragment>
  ));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
pnpm vitest run src/components/welcome/lib/splitChars.test.tsx
```
Expected: all 3 tests PASS.

- [ ] **Step 5: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/welcome/lib/splitChars.tsx src/components/welcome/lib/splitChars.test.tsx
git commit -m "feat(welcome): add splitChars helper for per-char animation"
```

---

## Task 2: `useReducedMotion` hook (TDD)

**Files:**
- Create: `src/components/welcome/lib/useReducedMotion.ts`
- Create: `src/components/welcome/lib/useReducedMotion.test.ts`

Purpose: returns `true` if user prefers reduced motion OR device is low-end (hardwareConcurrency < 4). SSR-safe (returns `true` server-side as the conservative default — animations skip during hydration).

- [ ] **Step 1: Write the failing test**

Create `src/components/welcome/lib/useReducedMotion.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
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

describe('useReducedMotion', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true,
      value: 8,
    });
  });

  it('returns false when motion is allowed and device is capable', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('returns true on low-core devices even without OS preference', () => {
    mockMatchMedia(false);
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true,
      value: 2,
    });
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
pnpm vitest run src/components/welcome/lib/useReducedMotion.test.ts
```
Expected: FAIL with "Cannot find module './useReducedMotion'".

- [ ] **Step 3: Implement the hook**

Create `src/components/welcome/lib/useReducedMotion.ts`:
```ts
'use client';

import { useEffect, useState } from 'react';

const MIN_CORES = 4;

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowEnd = (navigator.hardwareConcurrency ?? MIN_CORES) < MIN_CORES;

    const update = () => setReduced(mq.matches || lowEnd);
    update();

    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
pnpm vitest run src/components/welcome/lib/useReducedMotion.test.ts
```
Expected: all 3 tests PASS.

- [ ] **Step 5: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/welcome/lib/useReducedMotion.ts src/components/welcome/lib/useReducedMotion.test.ts
git commit -m "feat(welcome): add useReducedMotion hook with low-end device gate"
```

---

## Task 3: `AmbientShader` component (manual verify)

**Files:**
- Create: `src/components/welcome/AmbientShader.tsx`

Purpose: full-viewport WebGL canvas running a slow noise-gradient fragment shader. Self-contained, returns `null` when reduced-motion is true. Pauses rAF loop when `document.hidden`.

- [ ] **Step 1: Create the component**

Create `src/components/welcome/AmbientShader.tsx`:
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useReducedMotion } from './lib/useReducedMotion';

const VERTEX = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

// 2D value noise — cheap, smooth enough for slow drift
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float t = uTime * 0.04;
  float n = noise(uv * 2.0 + vec2(t, -t * 0.7));
  float m = noise(uv * 3.5 - vec2(t * 0.5, t));
  vec3 col = mix(uColorA, uColorB, smoothstep(0.2, 0.8, n));
  col = mix(col, uColorC, smoothstep(0.4, 0.9, m) * 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
}

export default function AmbientShader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(2, window.devicePixelRatio) });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    Object.assign(gl.canvas.style, { width: '100%', height: '100%', display: 'block' });

    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--primary').trim() || '#6366f1';
    const muted = '#1f2933';
    const accent = '#2d1b69';

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uTime: { value: 0 },
        uColorA: { value: hexToRgb(primary) },
        uColorB: { value: hexToRgb(muted) },
        uColorC: { value: hexToRgb(accent) },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uResolution.value = [container.clientWidth, container.clientHeight];
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let running = true;
    const start = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      gl.canvas.remove();
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/welcome/AmbientShader.tsx
git commit -m "feat(welcome): add AmbientShader with OGL fragment shader + perf gating"
```

(Manual verification deferred to Task 4 once orchestrator mounts it.)

---

## Task 4: Orchestrator + scene placeholders + delete ParallaxSection

**Files:**
- Modify: `src/components/welcome/index.tsx`
- Create: `src/components/welcome/scenes/HeroScene.tsx` (placeholder)
- Create: `src/components/welcome/scenes/TechScene.tsx` (placeholder)
- Create: `src/components/welcome/scenes/ProjectsScene.tsx` (placeholder)
- Create: `src/components/welcome/scenes/ContactScene.tsx` (placeholder)
- Delete: `src/components/ui/ParallaxSection.tsx`

Purpose: stand up the page skeleton so subsequent tasks fill in scenes incrementally.

- [ ] **Step 1: Create four placeholder scenes**

Each placeholder is a min-h-screen section with a title. Repeat for all four.

Create `src/components/welcome/scenes/HeroScene.tsx`:
```tsx
'use client';

export function HeroScene() {
  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <h2 className="text-foreground text-4xl">Act 1 · Hero (placeholder)</h2>
    </section>
  );
}
```

Create `src/components/welcome/scenes/TechScene.tsx` (same pattern, text "Act 2 · Tech (placeholder)").
Create `src/components/welcome/scenes/ProjectsScene.tsx` (same, "Act 3 · Projects (placeholder)").
Create `src/components/welcome/scenes/ContactScene.tsx` (same, "Act 4 · Contact (placeholder)").

- [ ] **Step 2: Replace `welcome/index.tsx` with the orchestrator**

Overwrite `src/components/welcome/index.tsx`:
```tsx
'use client';

import dynamic from 'next/dynamic';
import { ControlPanel } from '@/components/features/ControlPanel';
import { HeroScene } from './scenes/HeroScene';
import { TechScene } from './scenes/TechScene';
import { ProjectsScene } from './scenes/ProjectsScene';
import { ContactScene } from './scenes/ContactScene';

const AmbientShader = dynamic(() => import('./AmbientShader'), { ssr: false });

export function Welcome() {
  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-gradient-to-br from-background via-muted to-background"
      />
      <AmbientShader />
      <ControlPanel />
      <main className="relative">
        <HeroScene />
        <TechScene />
        <ProjectsScene />
        <ContactScene />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Delete `ParallaxSection.tsx`**

Run:
```bash
git rm src/components/ui/ParallaxSection.tsx
```

- [ ] **Step 4: Verify no remaining references**

Use Grep tool with pattern `ParallaxSection|GradientParallaxSection` over `src/`.
Expected: zero matches.

- [ ] **Step 5: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 6: Manual verify in dev server**

Run:
```bash
pnpm dev
```
Open `http://localhost:3000` in browser. Verify:
- Page loads without console errors.
- Four placeholder sections scroll naturally.
- Ambient shader renders behind (visible color drift if device is capable; null if reduced-motion).
- In DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", confirm shader unmounts (no canvas in DOM).

Kill the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add src/components/welcome/index.tsx src/components/welcome/scenes/
git commit -m "feat(welcome): orchestrator scaffold + 4 placeholder scenes, delete ParallaxSection"
```

---

## Task 5: Act 1 · HeroScene (manual verify)

**Files:**
- Modify: `src/components/welcome/scenes/HeroScene.tsx`

Purpose: editorial typography with split-char mask reveal, role tags stagger, Enter CTA, scrub-out as user leaves the section.

- [ ] **Step 1: Replace HeroScene with full implementation**

Overwrite `src/components/welcome/scenes/HeroScene.tsx`:
```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { splitChars } from '../lib/splitChars';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t, locale } = useTranslations();

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      const nameChars = inner.querySelectorAll('[data-anim="name"] [data-char]');
      const roleEls = inner.querySelectorAll('[data-anim="role"]');
      const ctaEl = inner.querySelector('[data-anim="cta"]');

      const tl = gsap.timeline();
      tl.from(nameChars, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.035,
        duration: 0.8,
        ease: 'expo.out',
      })
        .from(roleEls, { y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .from(ctaEl, { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

      gsap.to(inner, {
        opacity: 0,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center px-6"
    >
      <div ref={innerRef} className="max-w-5xl space-y-8 text-center">
        <div className="space-y-2">
          <h1
            data-anim="name"
            className="text-foreground overflow-hidden text-6xl leading-[1.05] font-black tracking-tight sm:text-7xl md:text-8xl"
          >
            {splitChars(t.welcome.name)}
          </h1>
          <h2
            data-anim="name"
            className="text-foreground overflow-hidden text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl md:text-7xl"
          >
            {splitChars(t.welcome.nickname)}
          </h2>
        </div>
        <p className="text-muted-foreground flex flex-col items-center justify-center gap-3 text-lg sm:flex-row sm:text-xl">
          <span data-anim="role">{t.welcome.role.fullstack}</span>
          <span data-anim="role" className="hidden sm:inline opacity-40">·</span>
          <span data-anim="role">{t.welcome.role.tech}</span>
          <span data-anim="role" className="hidden sm:inline opacity-40">·</span>
          <span data-anim="role">{t.welcome.role.game}</span>
        </p>
        <div data-anim="cta" className="pt-4">
          <Link
            href={`/${locale}/home`}
            className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary inline-flex h-12 items-center justify-center rounded-lg px-8 text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 active:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t.welcome.enter}
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 3: Manual verify**

Run `pnpm dev`, open `/`. Verify:
- Name characters reveal in stagger from below on mount.
- Role tags fade in after.
- CTA fades in last.
- As you scroll down, the hero content fades + scales down smoothly.
- With reduced-motion enabled (DevTools): everything renders immediately at final state, no animation.

- [ ] **Step 4: Commit**

```bash
git add src/components/welcome/scenes/HeroScene.tsx
git commit -m "feat(welcome): Act 1 — editorial hero with split-char reveal"
```

---

## Task 6: Act 2 · TechScene (manual verify)

**Files:**
- Modify: `src/components/welcome/scenes/TechScene.tsx`

Purpose: dark terminal aesthetic, pinned for 1.5x viewport, code "types out" character-by-character driven by scroll scrub. Token coloring uses existing `--hljs-*` CSS variables — no new dep.

- [ ] **Step 1: Replace TechScene with full implementation**

Overwrite `src/components/welcome/scenes/TechScene.tsx`:
```tsx
'use client';

import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Token = { text: string; color?: string };

function buildTokens(items: string[]): Token[] {
  const k = (s: string): Token => ({ text: s, color: 'var(--hljs-keyword)' });
  const t = (s: string): Token => ({ text: s, color: 'var(--hljs-entity)' });
  const str = (s: string): Token => ({ text: s, color: 'var(--hljs-string)' });
  const com = (s: string): Token => ({ text: s, color: 'var(--hljs-comment)' });
  const p = (s: string): Token => ({ text: s });

  const tokens: Token[] = [
    k('const'), p(' '), t('stack'), p(': '), t('TechStack'), p(' = ['),
    p('\n  '),
  ];
  items.forEach((item, i) => {
    tokens.push(str(`'${item}'`));
    if (i < items.length - 1) tokens.push(p(', '));
    if ((i + 1) % 3 === 0 && i < items.length - 1) tokens.push(p('\n  '));
  });
  tokens.push(p(',\n];\n'), com('// I ship things with them.'));
  return tokens;
}

export function TechScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslations();

  const tokens = useMemo(() => buildTokens(t.welcome.techStack.items), [t]);
  const fullText = useMemo(() => tokens.map((tk) => tk.text).join(''), [tokens]);

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const code = codeRef.current;
      if (!section || !code) return;

      const total = fullText.length;
      const state = { count: 0 };

      gsap.to(state, {
        count: total,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: true,
        },
        onUpdate: () => {
          const visible = Math.floor(state.count);
          let remaining = visible;
          const spans = code.querySelectorAll<HTMLSpanElement>('[data-token]');
          spans.forEach((span) => {
            const len = Number(span.dataset.len);
            if (remaining >= len) {
              span.style.opacity = '1';
              remaining -= len;
            } else if (remaining > 0) {
              span.style.opacity = '1';
              span.textContent = (span.dataset.full ?? '').slice(0, remaining);
              remaining = 0;
            } else {
              span.style.opacity = '0';
              span.textContent = '';
            }
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced, fullText] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950/95"
    >
      {/* grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <pre
        ref={codeRef}
        className="relative max-w-2xl px-6 font-mono text-base leading-relaxed text-zinc-100 sm:text-lg"
      >
        {tokens.map((tk, i) => (
          <span
            key={i}
            data-token
            data-len={tk.text.length}
            data-full={tk.text}
            style={{ color: tk.color, opacity: reduced ? 1 : 0 }}
          >
            {reduced ? tk.text : ''}
          </span>
        ))}
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.1em] bg-zinc-100"
          style={{ animation: 'blink 1s steps(2, end) infinite' }}
        />
      </pre>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 3: Manual verify**

Run `pnpm dev`. Scroll into Act 2. Verify:
- Background turns dark with subtle grid.
- As you scroll, code types character-by-character; reversing scroll un-types.
- Tech stack items appear with token colors.
- Comment at the end appears in muted gray.
- Cursor block blinks at the end.
- With reduced-motion: full code shown immediately, no pin.

- [ ] **Step 4: Commit**

```bash
git add src/components/welcome/scenes/TechScene.tsx
git commit -m "feat(welcome): Act 2 — terminal scene with scrub-driven type-out"
```

---

## Task 7: Act 3 · ProjectsScene (manual verify)

**Files:**
- Modify: `src/components/welcome/scenes/ProjectsScene.tsx`

Purpose: pinned section, vertical scroll translates an inner horizontal track. Each panel is a full-bleed gradient background with a large mix-blend title and tagline. Number of panels driven by `t.welcome.projects.items`.

- [ ] **Step 1: Replace ProjectsScene with full implementation**

Overwrite `src/components/welcome/scenes/ProjectsScene.tsx`:
```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Panel gradients — deterministic per index, brand-aligned
const GRADIENTS = [
  'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #ec4899 100%)',
  'linear-gradient(135deg, #042f2e 0%, #0d9488 60%, #fde047 100%)',
  'linear-gradient(135deg, #450a0a 0%, #b91c1c 60%, #fb923c 100%)',
  'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 60%, #fdbb2d 100%)',
];

export function ProjectsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslations();
  const projects = t.welcome.projects.items;

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || projects.length < 2) return;

      const panels = track.children.length;
      gsap.to(track, {
        xPercent: -100 * (panels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => '+=' + track.scrollWidth,
          scrub: 1,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced, projects.length] },
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <div ref={trackRef} className="flex h-full" style={{ width: `${projects.length * 100}%` }}>
        {projects.map((project, i) => (
          <div
            key={project.title}
            className="relative flex h-full shrink-0 items-center justify-center px-8"
            style={{ width: `${100 / projects.length}%`, background: GRADIENTS[i % GRADIENTS.length] }}
          >
            <div className="max-w-4xl text-center">
              <h3
                className="text-7xl leading-[1.05] font-black tracking-tight text-white sm:text-8xl md:text-9xl"
                style={{ mixBlendMode: 'difference' }}
              >
                {project.title}
              </h3>
              <p className="mt-6 text-xl text-white/90 sm:text-2xl">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 3: Manual verify**

Run `pnpm dev`. Scroll into Act 3. Verify:
- Section pins; vertical scroll translates the panels horizontally.
- Each panel fills the viewport with its gradient.
- Project title uses mix-blend-mode (looks "punched out" against the gradient).
- Section unpins cleanly after the last panel.
- No layout shift before/after pin.
- With reduced-motion: panels stack vertically (no pin, no transform), still readable.

- [ ] **Step 4: Commit**

```bash
git add src/components/welcome/scenes/ProjectsScene.tsx
git commit -m "feat(welcome): Act 3 — cinematic horizontal projects pin"
```

**Deferred from spec:** The "subtle inner parallax (bg slower than fg by ~20%) via containerAnimation child trigger" is intentionally NOT implemented here. It only becomes visually meaningful once real project hero images replace the gradient placeholders (spec lists that as an out-of-scope follow-up). When images land, add a `containerAnimation`-keyed child tween per panel that translates the bg layer at a slower x rate than the title.

---

## Task 8: Act 4 · ContactScene (manual verify)

**Files:**
- Modify: `src/components/welcome/scenes/ContactScene.tsx`

Purpose: editorial close. "Let's talk." headline mask-reveals on enter, platform buttons fade-up stagger.

- [ ] **Step 1: Replace ContactScene with full implementation**

Overwrite `src/components/welcome/scenes/ContactScene.tsx`:
```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { splitChars } from '../lib/splitChars';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ContactScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslations();

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll('[data-anim="contact-title"] [data-char]');
      const buttons = section.querySelectorAll('[data-anim="platform"]');
      const desc = section.querySelector('[data-anim="desc"]');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      tl.from(chars, { yPercent: 100, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'expo.out' })
        .from(desc, { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from(buttons, { y: 20, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <h2
        data-anim="contact-title"
        className="text-foreground overflow-hidden text-6xl leading-[1.05] font-black tracking-tight sm:text-7xl md:text-8xl"
      >
        {splitChars(t.welcome.contact.title)}
      </h2>
      <p data-anim="desc" className="text-muted-foreground mt-8 max-w-2xl text-xl">
        {t.welcome.contact.description}
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {t.welcome.contact.platforms.map((platform) => (
          <button
            key={platform}
            data-anim="platform"
            className="border-border bg-card/60 text-card-foreground rounded-lg border px-6 py-3 shadow-sm backdrop-blur transition-transform hover:scale-105 hover:bg-card"
          >
            {platform}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run:
```bash
pnpm typecheck && pnpm lint
```
Expected: both pass clean.

- [ ] **Step 3: Manual verify**

Run `pnpm dev`. Scroll to Act 4. Verify:
- Title chars reveal in stagger when section enters viewport at 70%.
- Description fades in after title.
- Platform buttons fade-up in stagger.
- Scrolling back up reverses the animation (toggleActions).
- With reduced-motion: everything shown immediately.

- [ ] **Step 4: Commit**

```bash
git add src/components/welcome/scenes/ContactScene.tsx
git commit -m "feat(welcome): Act 4 — editorial contact close"
```

---

## Task 9: Cross-scene reduced-motion audit (manual verify)

**Files:** none (verification + targeted fixes if any)

Purpose: validate the reduced-motion behavior holistically and catch any scene that silently breaks under reduce-motion.

- [ ] **Step 1: Hard-toggle reduced-motion in DevTools**

Open Chrome DevTools → ⋮ → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → `reduce`.

- [ ] **Step 2: Walk through all four acts**

Reload `/`. Verify:
- AmbientShader: no canvas in DOM (Elements panel search for `<canvas>`).
- Act 1 HERO: name + role + CTA all visible immediately, no entry animation.
- Act 2 TECH: full code visible immediately, no pin, no scrub. Scroll naturally past it.
- Act 3 PROJECTS: panels visible (stacked or laid out without horizontal animation). Scroll naturally past them.
- Act 4 CONTACT: title + desc + buttons all visible immediately.

- [ ] **Step 3: If any scene misbehaves, patch its useGSAP early-return**

The pattern in every scene is `if (reduced) return;` at the top of the `useGSAP` callback, plus `dependencies: [reduced]`. If a scene visibly misbehaves under reduced-motion, the most likely cause is a missing `reduced` short-circuit on a side-effect (e.g., a non-GSAP DOM mutation). Patch in-place.

- [ ] **Step 4: Toggle reduced-motion off and re-walk**

Confirm full animation suite returns.

- [ ] **Step 5: Commit if any patches applied**

```bash
git add -A src/components/welcome
git commit -m "fix(welcome): reduced-motion behavior parity across scenes"
```

(If no patches applied, skip the commit.)

---

## Task 10: Performance + polish pass

**Files:** none guaranteed; targeted polish only.

Purpose: confirm the page meets the spec's performance bar and patch any visible issues.

- [ ] **Step 1: CPU-throttled scroll FPS check**

Chrome DevTools → Performance → Throttling: 6× CPU. Record a 5-second scroll through all four acts. Verify:
- Average FPS ≥ 30 throughout.
- No long task > 100ms in the main thread.

- [ ] **Step 2: Lighthouse pass**

Run Lighthouse (Performance category, Mobile profile) on `/`. Verify:
- CLS ≤ 0.1
- LCP regression < 200ms vs. baseline (compare against pre-redesign main if needed)

- [ ] **Step 3: Mobile viewport sanity check**

DevTools device toolbar → iPhone 13. Verify:
- All four scenes render correctly.
- Horizontal pin in Act 3 works without breaking the page (or degrades acceptably).
- Address-bar collapse doesn't trigger a layout jump (use of `100dvh` should handle it).

- [ ] **Step 4: Console audit**

Reload `/`, walk through all four acts. DevTools Console should be clean — no errors, no warnings about ScrollTrigger leaks or React state updates on unmounted components.

- [ ] **Step 5: Apply any patches found, commit**

If issues surface (e.g., a scene shifts during pin setup, a panel overflows on mobile), patch in-place. Then:

```bash
git add -A
git commit -m "polish(welcome): perf and viewport pass"
```

(If no patches needed, skip the commit.)

- [ ] **Step 6: Final summary**

You're done. Push the branch and open a PR:

```bash
git push -u origin feature/welcome-scroll-story
gh pr create --title "feat(welcome): scroll-story redesign" --body "$(cat docs/superpowers/specs/2026-05-30-welcome-scroll-story-design.md | head -40)"
```

(Adjust the body command if `gh` isn't available — use the GitHub UI instead.)

---

## Verification summary

| Task | Verification |
|---|---|
| 0 | typecheck + lint clean |
| 1, 2 | vitest tests pass; typecheck + lint clean |
| 3 | typecheck + lint clean (visual deferred to Task 4) |
| 4 | placeholder scroll works; AmbientShader mounts/unmounts per reduced-motion |
| 5–8 | each scene: typecheck + lint clean + manual visual check (normal and reduced-motion) |
| 9 | reduced-motion holistic audit |
| 10 | throttled-CPU FPS, Lighthouse, mobile sanity, console clean |
