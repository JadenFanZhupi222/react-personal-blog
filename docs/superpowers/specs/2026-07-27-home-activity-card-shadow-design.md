# Home Activity Card Shadow Design

## Context

The LeetCode and Steam cards inside the dark `home-activity-shell` currently inherit the
page-level `--background` token when calculating their shadow. In the light theme that
token is pale, so the broad `0 16px 40px` shadow appears as a white haze around the
cards instead of a natural dark elevation.

## Approved Direction

Use the selected **B — compact dark shadow** treatment for activity cards:

- Keep the existing thin border and subtle inset top highlight.
- Replace the broad inherited shadow inside `home-activity-shell` with a compact,
  neutral-black shadow.
- Keep the treatment scoped to the home activity section so other
  `observatory-panel` usages retain their existing appearance.
- Preserve the current card structure, spacing, colors, hover effects, and responsive
  layout.

## Implementation

Add a scoped `.home-activity-shell .observatory-panel` rule in `src/app/globals.css`.
The rule will retain the existing inset highlight and use a smaller vertical offset,
lower blur radius, and translucent black for the exterior shadow. No component markup
changes are required.

## Verification

- Run the project lint/type checks available in the repository.
- Inspect the home activity section in the light theme at desktop width.
- Confirm the pale halo is gone, both cards retain restrained depth, and the shadow
  does not visually merge with or overpower the dark section background.
- Confirm the scoped rule does not alter observatory cards outside this section.
