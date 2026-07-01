# Developer Observatory Redesign Design

**Date:** 2026-07-01
**Status:** Approved direction, pending spec review
**Register:** Brand

## Summary

Redesign the personal blog and portfolio around a "Developer Observatory" visual system: a cinematic technical control room for code, writing, projects, and game/activity signals. The redesign should move beyond the current indigo/pink generic tech palette and make React Bits-inspired motion feel integrated into the brand rather than sprinkled on individual cards.

The site should feel like a precise personal command surface: dark, readable, observant, kinetic in the right places, and calm on long-form reading pages.

## Goals

- Create a stronger brand identity across the site through color, background, typography rhythm, and motion.
- Expand the existing React Bits-inspired components into page-level experiences where they have semantic value.
- Make `/en/home`, `/zh/home`, projects, about, contact, and achievements feel substantially redesigned.
- Preserve blog detail readability and keep article body content stable.
- Keep all animations optional via `prefers-reduced-motion`.
- Use the current stack: Next.js, React, Tailwind v4, Framer Motion, GSAP where already present, and local effect components.

## Non-Goals

- No information architecture rewrite.
- No database/API contract changes.
- No new broad animation dependency unless implementation proves the existing stack cannot support the design.
- No game-HUD treatment across the whole site.
- No constant motion over article text.
- No replacing the existing welcome scroll story; it can be visually aligned but not rebuilt from scratch.

## Brand Direction

Physical scene: a developer opens a personal observatory dashboard at night, with code, writing, project telemetry, and play history shown as quiet instrument panels under low ambient light.

Voice words:

- Instrumented
- Cinematic
- Personal

The palette should move away from default AI-tech purple. Proposed strategy is **Committed dark**:

- Body background: near-black green/graphite, not pure black.
- Primary signal: electric cyan or mint used for active navigation, focus, and high-value motion.
- Secondary signal: muted amber used sparingly for Steam/achievement rarity and highlights.
- Surface colors: graphite, deep green-black, and ink blue-gray.
- Text: high-contrast off-white with tinted muted text that remains WCAG AA.

Exact colors should be implemented as CSS variables in `src/app/globals.css`, preferably with OKLCH values where practical.

## Animation Strategy

React Bits-inspired animation should be assigned by meaning:

- **Observation / system ambience:** grid aura, pointer glow, subtle scan beams, and noise-like depth live behind main content.
- **Identity reveal:** home and page headers can use split/reveal text, but body content remains visible and stable.
- **Inspection affordance:** project, skill, contact, and game cards use glare, spotlight borders, and magnetic response.
- **Progress / achievement:** LeetCode, Steam, and achievement areas use shimmer, rare glow, and progress motion.
- **Reading support:** code blocks use scanline framing and improved copy feedback; article prose does not animate.

All animation must render content visible before motion runs. Reduced motion disables pointer glow, magnetic movement, looping shimmer, beams, rare pulse, and scanline movement.

## Page Design

### Global Shell

`ReactBitsEffects` should evolve from a simple aura into a page-aware observatory ambience:

- Home/about/projects/contact/achievements get full ambience.
- Blog list gets a quiet ambience.
- Blog detail keeps ambience disabled or extremely minimal.
- Background should include a darker observatory field, subtle grid, radial signal glow, and a faint scan beam.
- Pointer glow stays hidden on coarse pointers and reduced motion.

### Navigation

`Navbar` should become a compact command bar:

- Translucent graphite surface with stronger blur and border.
- Active route indicator via signal dot or animated underline.
- Brand text can behave like a small system label rather than a plain bold word.
- Theme and language controls stay accessible and visible.
- Mobile menu should inherit the same observatory surface treatment.

### Home

Home becomes the main observatory dashboard:

- Replace centered welcome block with an asymmetric hero/dashboard composition.
- Left side: identity, short description, primary route actions.
- Right side: activity snapshot modules using LeetCode and Steam data.
- Feature navigation becomes a mixed-size module grid rather than three equal centered cards.
- Text reveal is reserved for the main heading and possibly one supporting signal label.
- LeetCode progress bars can gain shimmer-on-load or shimmer-on-hover.
- Steam card can get amber rare-signal edge treatment but not dominate the page.

### About

About should feel like a technical profile scanner:

- Page header gains a stronger layout with a concise identity statement.
- Skills become grouped signal chips or compact instrument cards.
- Skill cards use magnetic hover and spotlight borders.
- Experience cards become a timeline or stacked log with active rail and scroll reveal.
- Motion should help scanning rather than hide content.

### Projects

Projects should become an inspection wall:

- Replace plain vertical cards with asymmetric project slabs.
- Each project gets a stronger title, description, highlights, and tag grouping.
- Use glare/spotlight card surfaces.
- Tags can shimmer on hover/focus only.
- External link affordance should be clear and keyboard focusable.

### Blog List

Blog list should stay quiet but more intentional:

- Improve card layout and typography for scanning.
- Add subtle staggered reveal and tag hover shimmer.
- Use less heavy card styling than dashboard modules.
- Keep metadata legible and stable.

### Blog Detail

Blog detail is a reading surface:

- Keep global ambience off or nearly invisible.
- Improve article container, heading spacing, metadata, tags, and footer nav.
- Keep code scanline and copy feedback.
- No animated paragraph/headline body effects.

### Contact

Contact becomes signal channels:

- Replace equal static cards with three channel panels.
- GitHub, email, and social channels can use magnetic/glare response.
- Contact values remain selectable/copyable where appropriate.
- Use restrained motion and visible focus states.

### Achievements

Achievements can carry the highest localized game energy:

- Featured game becomes a stronger hero card.
- Game cards use glare/depth and cover-image-led hierarchy.
- Rare achievements use amber glow only when rarity warrants it.
- Search/sort controls become command-bar controls.
- Progress and rarity affordances can shimmer or pulse only on interaction or when semantically important.

## Component Changes

Expected areas to modify:

- `src/app/globals.css`: color tokens, observatory backgrounds, keyframes, reduced-motion rules.
- `src/components/effects/*`: extend existing aura, text reveal, glare, magnetic, glow, and scanline behavior if needed.
- `src/components/layout/Navbar.tsx` and `MobileMenu.tsx`: command bar styling and active state.
- `src/components/home/index.tsx`: main dashboard redesign.
- `src/components/home/LeetCodeCard/*` and `SteamCard/*`: activity-module treatment.
- `src/components/features/FeatureCard/index.tsx`: module-grid card redesign.
- `src/components/about/*`: profile scanner and timeline treatment.
- `src/components/project/index.tsx`: inspection wall redesign.
- `src/components/blog/index.tsx` and `detailPage/*`: quiet list polish and detail reading polish.
- `src/components/contact/*`: channel panel redesign.
- `src/components/achievements/*`: game/achievement-localized motion polish.

## Accessibility

- Maintain WCAG AA contrast for body text, controls, and metadata.
- Preserve keyboard navigation and visible focus rings.
- Do not rely on hover-only states for essential information.
- Content must be visible before animation runs.
- Reduced motion must disable continuous or pointer-driven movement.
- Background effects must be `aria-hidden` and `pointer-events: none`.

## Performance

- Avoid React state for continuous pointer tracking.
- Prefer CSS variables, refs, Framer Motion values, and existing GSAP patterns.
- Keep WebGL limited to existing welcome surfaces unless there is a strong reason.
- Avoid mounting heavy ambience on blog detail pages.
- Avoid animating layout properties; use transform, opacity, filter, clip-path, and background position carefully.

## Testing And Verification

Run:

```bash
pnpm test:run
pnpm typecheck
pnpm lint
```

Visual inspection should cover:

- `/`
- `/en/home`
- `/en/about`
- `/en/projects`
- `/en/blog`
- one blog detail page
- `/en/contact`
- `/en/achievements`

Check desktop and mobile widths, light/dark themes if both remain supported, keyboard focus, and reduced-motion behavior.

## Risks

- The redesign can become too game-like if achievement visuals leak into global UI. Keep amber rarity glow localized.
- Too many effects can make the site feel noisy. Use motion for meaning and keep reading surfaces calm.
- The current light theme may become visually weaker if the new identity is dark-first. Either redesign light mode deliberately or treat dark as the primary brand surface with a restrained light fallback.
- Existing card components are shared; redesign changes should avoid breaking loading, error, and skeleton states.

## Open Decisions For Implementation

- Whether light mode remains a full first-class visual system or a simpler readable fallback.
- Whether to add one additional local effect component for scan-beam/noise, or extend `GridAura`.
- Whether contact email values should gain copy-to-clipboard behavior during the redesign.
