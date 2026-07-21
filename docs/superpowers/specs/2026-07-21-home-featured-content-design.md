# Home featured content redesign

## Goal

Replace the homepage's equal category-card row with a content-led composition that shows verifiable work and creates a clear visual hierarchy.

## Approved direction

- Move the About entry into the hero as a compact text link.
- Show two editorial entries below the hero: one dominant real project and one secondary real article.
- Source titles, descriptions, tags, dates and links from the existing MongoDB project/blog collections.
- Feature the personal blog project because its live interface can provide a genuine project image. Feature the family recipe development article because it connects a shipped project with a concrete engineering write-up.
- Capture real pages from this site for the two covers; do not generate replacement still-life artwork.
- Use a desktop `2:1` asymmetric composition and a single-column mobile flow.
- Remove index numbers, decorative icons, duplicated labels and redundant CTA markers.
- Keep the black frame and restrained yellow accent, but let the real screenshots provide visual variation.

## Accessibility and performance

- Keep the whole media item clickable with a visible focus ring.
- Preserve responsive image sizing and prevent layout shift.
- Maintain readable title contrast with an image overlay.
- Keep database reads server-side and cached through the existing data helpers.

## Verification

- Test that the equal three-column/category-card structure is absent.
- Test that home server data includes projects and blogs.
- Run tests, typecheck, lint and build.
- Inspect desktop and 390px mobile layouts before merging into `dev`.
