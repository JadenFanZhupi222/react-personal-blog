# Home editorial feature layout

## Problem

The current project and article cards use full-page screenshots as card backgrounds and place most copy over those screenshots. This creates a page-within-a-page effect, makes the article title compete with code, and gives two different content types nearly identical treatment.

## Design direction

Turn the section into an editorial feature block rather than a pair of matching cards.

- Keep the existing section title, real database content, black surfaces, and yellow accent.
- Present the featured project as the dominant story: a wide, shallow image area followed by a separate black caption panel.
- Present the article as a compact side column: a cropped code image at the top and a denser text panel below.
- Never overlay the title or description on screenshots. Only the small content-type label may sit over an image when contrast is guaranteed.
- Reduce the section's overall height and use a wider gap so the two entries read as distinct editorial objects.
- Give each content type its own proportions while preserving the desktop two-to-one hierarchy.
- Stack both entries on mobile, with the project first and shorter media crops to keep the page moving.

## Component changes

- Replace the all-overlay `FeatureCard` composition with two explicit regions: `media` and `content`.
- Add a `compact` presentation for the article while keeping a shared semantic link/article component.
- Keep metadata short and place it above the title in the text region.
- Use a simple directional text link as the call to action; avoid extra icons, indices, badges, borders, or ornamental UI.

## Interaction and accessibility

- The full entry remains clickable and keyboard focusable.
- Hover applies a restrained image zoom and a small CTA color shift without moving the entire card.
- Motion is disabled when reduced motion is requested.
- Images retain meaningful alternative text supplied by the caller.
- Text remains readable without depending on image overlays.

## Responsive behavior

- Desktop: a two-column grid with an approximately `2fr / 1fr` split; entries may have different natural heights.
- Tablet and mobile: one column; image aspect ratios become wider and text sizes step down.
- Long article titles use balanced wrapping and controlled line height rather than aggressive truncation.

## Verification

- Update the homepage component test to assert separate media/content structure and the absence of full-card overlay copy.
- Run focused tests, the full test suite, type checking, linting, and production build.
- Inspect the section at desktop and 390px mobile widths in the local browser.

