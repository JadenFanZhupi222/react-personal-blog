# Zoda Plus project entry design

## Goal

Add `gustomedialab/zoda-plus-frontend` to the bilingual portfolio and expand the
homepage selected-project carousel from three projects to four. The entry should
describe the verified product and engineering work without exposing private
implementation secrets or claiming unfinished capabilities.

## Project position

Keep the previously established AI Photo Booth lead position and use this
homepage order:

1. AI Photo Booth
2. Zoda Plus
3. Git Client
4. Family Meal Planner

The projects page continues to use the same Payload order. The existing
`personal-homepage` exclusion remains unchanged.

## Portfolio content

Create one localized Payload project record with the stable slug
`zoda-plus-frontend` and repository URL
`https://github.com/gustomedialab/zoda-plus-frontend`.

The Chinese and English descriptions present Zoda Plus as a park photo product
implemented as one frontend monorepo for three terminals:

- an iPad entrance kiosk;
- a phone web capture flow;
- a Windows Electron exit-print kiosk.

Use four concise highlights covering:

1. the shared Expo/React Native implementation for iOS and web capture;
2. the Electron printing workflow, QR scanning, device state, and error
   recovery;
3. the pnpm/Turborepo architecture and shared API, schema, recipe, and UI
   packages;
4. tenant-driven theming and assets, bundled fallbacks, Storybook, automated
   checks, and Windows packaging.

Tags should represent the defining technologies rather than every dependency:
`Expo`, `React Native`, `Electron`, `TypeScript`, and `Turborepo`.

## Data flow

Payload remains the only runtime source of truth. Add a typed bilingual content
definition and an idempotent Local API upsert path, following the existing Git
Client project pattern. Extend the centralized featured-project order so the
upsert command can apply and verify the selected order without introducing a
second homepage-only data list.

The homepage server component continues to fetch projects through
`getAllProjects`, excludes `personal-homepage`, sorts by Payload order, and
changes only its final selection limit from three to four.

## Dedicated artwork

Add a Zoda-specific branch to `ProjectArtwork`. The cover keeps the existing
dark editorial artwork frame and yellow accent, but depicts the product as a
three-terminal operational system:

- an entrance/iPad node with a camera aperture;
- a phone-web node with an upload signal;
- an exit/Windows node with a printed-photo tray;
- a wristband QR marker and a connecting route between the three nodes.

The composition is CSS and SVG markup only, so it adds no new media download or
asset-management path. It must remain readable at the existing mobile and
desktop carousel sizes and include a stable artwork label for tests.

## Verification

- Unit tests validate both localized content shapes, tags, URL, and idempotent
  create/update behavior.
- Ordering tests validate AI Photo Booth, Zoda Plus, Git Client, and Family Meal
  Planner in the selected order.
- Homepage source tests validate a four-project selection.
- Artwork tests validate that `zoda-plus-frontend` selects the dedicated cover
  instead of a legacy fallback.
- Run the focused tests, full Vitest suite, typecheck, lint, and production
  build.

## Out of scope

- Changing the overall carousel interaction or visual layout.
- Adding a new project-detail route.
- Publishing private environment values, tenant credentials, or backend
  details.
- Claiming production deployment status, real printer hardware acceptance, or
  backend ownership beyond what the repository verifies.
