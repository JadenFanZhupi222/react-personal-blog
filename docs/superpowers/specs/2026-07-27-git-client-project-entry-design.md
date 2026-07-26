# Git Client project entry design

## Goal

Add the existing Git Client desktop application to the portfolio as project data. It should appear in both the projects page and the homepage selected-project carousel.

## Scope

- Add one localized Payload project record with Chinese and English content.
- Use the stable slug `git-client`.
- Link the project to `https://github.com/JadenFanZhupi222/git-client`.
- Give it a low enough `order` value to appear in the homepage's first three selected projects.
- Add the smallest necessary `ProjectArtwork` mapping so the homepage does not render the unrelated date-picker fallback.

The change does not add a project-detail route, a browser version of the desktop application, download hosting, or release claims.

## Content

The entry presents the application as a Tauri 2, React 19, and Rust desktop Git client. Its highlights focus on:

- daily and advanced Git workflows;
- the layered Rust workspace and typed IPC boundary;
- diff, history, conflict-resolution, and collaboration tooling;
- cross-platform CI, tests, and release-readiness checks.

The wording must distinguish implemented functionality from unfinished production signing, notarization, updater provisioning, and hardware acceptance.

## Data flow

Payload remains the source of truth. Existing project queries fetch the localized record, the projects page renders the complete entry, and the homepage selects it through the existing order-based selection logic.

## Verification

- Verify both locales map to the public `Project` type.
- Verify `git-client` selects dedicated artwork.
- Verify the project satisfies the homepage selection rules.
- Run the focused project tests, typecheck, and lint for changed files.
