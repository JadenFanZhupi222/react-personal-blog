# Rockstar-inspired UI refinement

## Goal

Refine the complete personal blog UI without replacing its information architecture, content model, routes, or existing functionality. The result should remain recognizably the current developer observatory while gaining the visual confidence, contrast, and directness associated with Rockstar Games' website.

## Scope

The refinement covers the entrance, navigation, home, about, projects, blog lists and details, contact, achievements, loading, empty, and error states. Existing bilingual content, light and dark themes, reduced-motion behavior, API integrations, and routing remain intact.

## Visual system

- Replace the teal-led palette with a graphite, warm-white, and muted warm-yellow system.
- Use near-black and warm off-white instead of absolute black and white.
- Reserve yellow for primary actions, active navigation, important status, and small focal details.
- Retain Geist for body copy and data, but increase display-heading weight, reduce tracking, and tighten line height.
- Reduce large rounded corners and pill treatments. Prefer straight edges, restrained radii, dividers, and whitespace.
- Remove layered decorative competition: a component should not combine magnetic movement, glare, shimmer, scale, and a strong panel treatment.

## Page hierarchy

- Keep all current routes and component responsibilities.
- Standardize page shells, content widths, top spacing, section labels, and heading rhythm.
- Make the entrance and home page the most expressive surfaces.
- Keep article detail pages calm, narrow, and optimized for long-form reading.
- Convert repetitive card stacks into clearer editorial rows or asymmetric grids where the existing data permits it.
- Give contact, empty, loading, and error pages the same page identity as primary content pages.

## Components

- Navigation: stronger black/graphite bar, compact active state, reliable mobile behavior, and visually quieter utility controls.
- Page headers: replace the decorative signal pill with a compact section marker and stronger headline.
- Panels and cards: flatten unnecessary nesting, reduce border effects, and use a consistent hover lift or color change.
- Buttons and links: consistent focus, hover, and pressed states; yellow reserved for primary emphasis.
- Tags and metadata: smaller squared labels and quieter secondary text.
- Activity and achievement modules: keep their domain-specific color semantics while placing them inside the shared neutral system.

## Motion and accessibility

- Retain purposeful entrance and feedback motion only.
- Use transform and opacity, with short durations and no competing effects.
- Continue honoring `prefers-reduced-motion`.
- Preserve visible keyboard focus, semantic landmarks, readable contrast, and mobile touch targets.

## Implementation boundaries

- Work within the current Next.js, React, Tailwind CSS v4, Framer Motion, and GSAP stack.
- Do not add dependencies or change data contracts.
- Prefer shared token and primitive changes, followed by targeted page adjustments.
- Preserve all existing user functionality and unrelated local changes.

## Verification

- Run the focused component and theme tests during implementation.
- Run the full unit test suite, typecheck, lint, and production build before completion.
- Inspect representative desktop and mobile views in both light and dark themes, including the entrance, home, blog list/detail, projects, contact, and achievements pages.
