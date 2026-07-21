# Home project carousel redesign

## Goal

Replace the mixed project/article card pair with a portfolio-first showcase that presents three real projects, uses deliberate project artwork, and keeps technical writing as a separate content type.

## Content selection

The project carousel excludes the `personal-homepage` record, sorts the remaining localized projects by `order`, and uses the first three entries:

1. AI photo booth desktop application
2. Family meal planner mini program
3. Date picker

The personal blog homepage is excluded because the visitor is already viewing that product. Blog articles are excluded from the carousel and move into a separate latest-writing section.

## Public-content sanitization

Update both localized database records for the photo booth project before exposing it on the homepage.

- Chinese title: `AI 拍照亭桌面应用`
- English title: `AI Photo Booth Desktop Application`
- Change the shared slug to `ai-photo-booth-desktop` so the removed name is not exposed in public data.
- Remove the company or product name from titles, descriptions, and highlights.
- Replace the scoped private package name with the generic phrase `可配置 UI 系统` / `configurable UI system`.
- Keep only general technical information about Electron, camera flow, AI generation, payment, printing, multi-brand configuration, remote JSON, offline assets, and diagnostics.
- Remove the private repository URL. The carousel uses the projects page as its internal destination when a project has no public URL.
- Create a database backup before applying these content changes.

## Recommended composition

Use one large manual carousel rather than multiple equal cards.

- One project occupies the main stage at a time.
- Desktop uses a wide split composition: project copy on the left and art-directed media on the right.
- A narrow portion of the next slide may remain visible to signal horizontal movement, provided it does not create horizontal page overflow.
- Mobile shows one full-width slide and supports horizontal swipe.
- The carousel never advances automatically.
- Previous/next controls, a `01 / 03` counter, keyboard navigation, and visible focus states are provided.
- Motion uses a restrained horizontal transition and respects reduced-motion preferences.

## Project artwork

Do not use full-page website screenshots or repeat the site's navigation inside a cover.

- Photo booth: a brand-neutral booth/device composition with a camera preview, print strip, and restrained UI fragments. It must not include the removed product name, company identifiers, customer data, or private screen details.
- Family meal planner: a focused phone-frame composition built from public project UI or a faithful capture of the public mini-program screens, emphasizing recipes and meal planning.
- Date picker: a close crop of the working date-range interaction, showing calendar cells and selected dates rather than a repository page.
- All three covers share the same black, off-white, and yellow art direction while retaining different layouts and imagery.
- Artwork must remain readable without overlaying paragraph copy on top of detailed screenshots.

## Slide content

Each slide contains:

- localized project title;
- a concise localized description;
- up to three technology tags;
- one short project highlight;
- a text link to the public repository when available, otherwise the localized projects page.

The component receives localized project data from the existing server-side `getAllProjects()` result. It does not hard-code project copy.

## Latest writing section

Add a lightweight section below the carousel for up to three latest localized articles.

- Use text-led rows rather than image cards.
- Show title, date, read time, and a directional link.
- Keep the section visually quieter than the project carousel.
- Source the articles from the existing server-side blog data already provided to the homepage.

## Component boundaries

- `HomeProjectCarousel`: owns selection state, navigation controls, counter, and keyboard/swipe behavior.
- `ProjectSlide`: renders one localized project's copy and artwork.
- `LatestWriting`: renders the article list without carousel behavior.
- `HomePage`: composes the sections and supplies localized data only.
- Remove `FeatureCard` from the homepage path. Delete it only if no other source file imports it.

## Error and empty states

- With three or more projects, show the first three ordered entries.
- With one project, render a static project feature and hide navigation controls.
- With no projects, render a compact link to the projects page without an empty media frame.
- With no articles, omit the latest-writing section.
- Missing artwork falls back to a project-specific neutral graphic rather than a broken image.

## Verification

- Add tests for project selection, carousel controls, fallback destinations, sanitized public copy, and the separated latest-writing section.
- Verify the database backup and both localized photo booth records after migration.
- Run the full test suite, type checking, linting, and production build.
- Inspect desktop and 390px mobile layouts, including keyboard focus, reduced motion, slide navigation, and horizontal overflow.
