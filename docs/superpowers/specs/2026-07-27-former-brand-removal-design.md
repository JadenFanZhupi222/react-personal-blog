# Former Brand Removal Design

## Goal

Keep the multi-terminal project in the portfolio while removing the former
employer's product brand from the current website, CMS content, source code,
tests, scripts, and planning documents.

## Public Identity

Use a factual, brand-neutral project identity:

- Chinese title: `多终端拍摄与打印系统`
- English title: `Multi-Terminal Capture & Print System`
- Slug: `multi-terminal-capture-print-system`
- Repository URL: empty

The descriptions continue to explain the three-terminal architecture and the
author's technical contribution without naming the former employer or product.
The dedicated cover remains, but its component and tests use neutral names.

## Source Cleanup

Rename the project data module, CMS command, tests, artwork component, and
featured-order slug to the neutral identity. Remove the superseded design and
implementation documents because they contain the restricted brand and
repository URL. Add a regression test that scans the current tracked source
tree for the restricted terms so they cannot be reintroduced accidentally.

The regression scan excludes Git metadata, dependencies, generated build
output, local tool state, and worktree directories. Git history is not rewritten
because that would require a destructive force-push outside this change.

## CMS Migration

Update the existing CMS record in place. The migration locates the record by
either the new neutral slug or its unique featured order value (`-15`), then
updates both locales with the neutral slug, titles, descriptions, and an empty
URL. This avoids embedding the former slug in the migration and prevents a
duplicate project from being created.

## Rendering

The homepage carousel keeps the project in second position and selects its
dedicated three-terminal artwork with the new slug. On the projects page,
projects without a URL render a non-linked title without the external-link
icon. The homepage carousel already falls back to the local projects page when
the URL is empty.

## Verification

- The restricted brand and repository identifier return zero matches in the
  current tracked source tree.
- Unit tests cover project data, in-place CMS migration, featured ordering,
  artwork selection, optional project links, and the restricted-term scan.
- The CMS upsert and verification commands pass for both locales.
- The homepage and projects page display the neutral title and no external
  repository link.
- Type checking, linting, and the full test suite pass.
