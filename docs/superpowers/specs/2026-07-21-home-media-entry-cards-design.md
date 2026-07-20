# Home media entry cards

## Goal

Replace the current empty-looking feature cards with a compact media-led navigation row that fits the homepage's cinematic direction. The change is limited to the About, Projects, and Writing entry cards.

## Visual direction

- Use three equal-width cards on desktop and a single-column list on mobile.
- Give each card a distinct original cover image tied to its destination.
- Place the index and one title over the image; do not repeat the title below it.
- Keep the content footer short: one description and one text link.
- Use yellow only for the small index/CTA marker and interaction feedback.
- Preserve the existing rounded geometry, dark surface, focus ring, and restrained hover motion.

## Content and behavior

- Keep existing localized titles, descriptions, actions, and routes.
- Keep the whole card clickable.
- Keep keyboard focus visible.
- Use `next/image` with responsive sizing and descriptive localized-neutral alt text.
- Respect reduced-motion behavior already provided by the site's animation layer.

## Responsive layout

- Desktop: three equal columns with aligned image and footer regions.
- Tablet: two columns, then wrap the third card naturally.
- Mobile: one column with a shallower media ratio so each destination remains scannable.
- No horizontal overflow from 390px upward.

## Verification

- Add or update focused component-source tests for equal columns, media covers, and non-duplicated titles.
- Run the full test suite, TypeScript, ESLint, and production build.
- Inspect desktop and 390px mobile layouts in the local browser.

## Scope exclusions

- No changes to the main hero, navigation, activity modules, database content, or destination pages.
- No Rockstar artwork, logos, characters, or other protected assets.
