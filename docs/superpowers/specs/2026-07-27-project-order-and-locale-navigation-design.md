# Project order and locale navigation design

## Goal

Keep AI Photo Booth as the leading portfolio project, add Git Client to the welcome experience, and prevent locale switches from displaying stale project data.

## Project order

The shared portfolio order is:

1. AI Photo Booth
2. Git Client
3. Family Meal Planner

AI Photo Booth receives an order value lower than Git Client. Git Client remains ahead of the remaining records. The existing homepage rule continues to exclude the personal-site project, so its three selected projects follow the order above without new selection logic.

## Welcome project scene

Replace the welcome scene's legacy Personal Blog and Date Picker entries with three bilingual entries:

1. AI Photo Booth
2. Git Client
3. Family Meal Planner

The existing horizontal pinned-scroll presentation, numbering, accents, responsive layout, and reduced-motion behavior remain unchanged. Only the localized project content and resulting panel count change.

## Locale navigation

The current language switch uses `router.push()`. A locale route may already exist in the Next.js client router cache, so switching from `/zh/projects` to `/en/projects` can display prefetched project data that predates a CMS update. A direct refresh retrieves the current server result, which matches the reported reproduction.

Localized-route language changes will use a full document navigation to the equivalent locale-prefixed URL after saving the locale cookie. This trades a brief page reload for deterministic server-fresh content. The welcome route remains a client-only locale change because it reads static translation dictionaries and has no locale-prefixed destination.

## Data update

The Git Client upsert definition will no longer force it ahead of AI Photo Booth. An idempotent portfolio-order command will update both records through Payload and verify the final order in both locales.

## Verification

- A language-switch test verifies that localized routes use full navigation rather than `router.push()`.
- Translation tests verify both locales contain the same three welcome projects in the same order.
- Project data tests verify AI Photo Booth sorts before Git Client.
- CMS verification confirms the same record IDs and expected order values in English and Chinese.
- Run the complete test suite, typecheck, lint, and production build.
