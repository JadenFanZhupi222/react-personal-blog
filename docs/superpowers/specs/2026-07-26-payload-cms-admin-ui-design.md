# Payload CMS Admin UI Design

## Goal

Turn the recently integrated Payload admin panel into a polished personal content workspace while preserving Payload's native authentication, routing, collection views, form behavior, permissions, and upgrade path.

The redesigned admin experience should:

- feel visually related to the public site's graphite, warm-white, and muted warm-yellow identity;
- make posts, projects, experiences, media, and site settings equally easy to reach;
- improve bilingual Markdown authoring without changing the stored content format;
- provide an actionable overview instead of Payload's generic dashboard;
- support full desktop editing and reliable mobile quick edits;
- remain maintainable across Payload upgrades by using documented admin extension points.

## Product Context

The CMS is primarily a personal tool used by one technical administrator. The interface language remains English, while content fields retain Payload's `en` and `zh` localization. Posts, projects, experiences, and site settings are used with similar frequency, so the navigation and dashboard must not overemphasize blogging.

Analytics, team onboarding, editorial approval workflows, and new data stores are outside this design.

## Chosen Approach

Use Payload's native admin extension points rather than replacing its admin application.

- Keep `RootLayout`, authentication, collection lists, document forms, version controls, access rules, and destructive-action confirmations.
- Register branding, dashboard, and field components through `admin.components` in `src/payload.config.ts`.
- Load a dedicated admin stylesheet scoped to the Payload route.
- Read dashboard summaries with the Payload Local API; do not add a reporting table or duplicate content.
- Keep Markdown as a localized string. The custom field enhances editing and previewing but submits the same value shape as the current textarea.

This approach provides meaningful customization without copying or forking Payload's internal views.

## Visual Direction

The visual direction is **Editorial Control Room**, refined for long editing sessions rather than styled as an industrial terminal.

### Color

- Dark theme: warm near-black page background with layered graphite surfaces.
- Light theme: warm off-white background with clean neutral surfaces.
- Primary accent: muted warm yellow for primary actions, keyboard focus, active navigation details, and important draft cues.
- Success, warning, destructive, and publication states keep distinct semantic colors.
- Dark and light themes follow the operating-system preference by default and remain manually switchable through Payload's theme behavior.

### Typography

- Use the project's existing Geist Sans for navigation, labels, controls, headings, and editorial text.
- Use Geist Mono only for counts, timestamps, statuses, keyboard shortcuts, slugs, and Markdown input.
- Page headings use approximately 650 weight, tight tracking, and natural casing.
- Navigation and body copy use moderate weights between 450 and 580.
- Uppercase is limited to small metadata kickers; buttons, navigation, titles, and content names use natural casing.

### Geometry and Surfaces

- App frame and large shells: approximately 14–17px radius.
- Content panels: approximately 10–12px radius.
- Buttons and inputs: approximately 8–9px radius.
- Compact navigation and status elements: approximately 6–8px radius.
- Avoid oversized pills.
- Use subtle borders, restrained shadows, faint warm environmental light, and small surface-level shifts to establish hierarchy.
- Decorative effects must remain subordinate to content and actions.

### Motion

- Use short opacity and transform transitions for navigation, mode changes, status feedback, and light card entry.
- Do not animate text input, resize the editor during typing, or add continuous decorative motion.
- Honor `prefers-reduced-motion`.

## Information Architecture

The primary sidebar order is:

1. Overview
2. Posts
3. Projects
4. Experience
5. Media
6. Site Settings

Overview and content collections form the `Workspace` group. Site Settings appears under a separate `Configuration` label. Users and other administrative collections remain accessible only where operationally necessary and should not compete with routine content navigation.

The desktop sidebar remains persistent. On narrow screens it collapses into Payload's mobile navigation while preserving the same order and labels.

## Dashboard

Replace the generic Payload dashboard with an actionable content overview.

### Header

- Current date and a short contextual summary.
- Global `Create content` action opening choices for a post, project, or experience.
- Access to Payload's command/search behavior when available.

### Summary

Show compact cards for:

- draft posts awaiting continuation;
- total posts and published count;
- total projects and localization readiness;
- total experiences and last update;
- media count when space permits.

The draft queue receives slightly stronger warm-yellow emphasis because it represents unfinished work. Other metrics remain visually quiet.

### Recently Updated

Show a bounded list of the most recently updated posts, projects, and experiences. Each row includes:

- content type;
- localized title using the active admin locale with fallback;
- last update time;
- publication status when applicable;
- direct link to the document.

### Quick Create

Provide direct actions for:

- new post;
- new project;
- new experience;
- site settings.

### Responsive Behavior

On mobile:

- collapse the sidebar;
- place `Create content` near the top;
- reduce summary cards to a two-column grid;
- prioritize draft count and recent items;
- hide secondary metric detail before hiding primary actions.

## Collection and Field Organization

Retain Payload's native collection and document layouts while improving labels, descriptions, grouping, and sidebar placement.

### Posts

Main content column:

- localized title;
- shared slug beside the title on desktop;
- localized description;
- localized Markdown content.

Document sidebar:

- draft and publication status;
- publication date;
- read time;
- tags;
- updated timestamp.

### Projects

Main content column:

- localized title;
- shared slug;
- localized description;
- localized highlights.

Document sidebar:

- URL;
- tags;
- display order;
- updated timestamp.

### Experiences

Main content column:

- localized title;
- localized company;
- localized description;
- localized achievements.

Document sidebar:

- start and end dates;
- display order;
- updated timestamp.

The hidden migration key remains hidden.

### Site Settings

Use clearly labeled collapsible sections for:

- skills;
- GitHub;
- email addresses;
- social profiles.

Array rows use human-readable row labels where Payload supports them. Technical values such as `iconKey` receive concise help text instead of relying on implementation knowledge.

## Markdown Editor

Replace the post content textarea with a custom localized string field that provides `Edit` and `Preview` modes.

### Edit Mode

- Remains the default mode.
- Uses Geist Mono, comfortable line height, visible focus treatment, and a height suitable for long-form writing.
- Provides a restrained toolbar for inserting common Markdown syntax such as headings, emphasis, links, code, and lists.
- Shows a word count.
- Keeps standard keyboard input and undo behavior.

The toolbar inserts syntax into the string value and does not introduce a rich-text document model.

### Preview Mode

- Replaces only the Markdown editing canvas.
- Reuses the public article renderer's Markdown, GitHub Flavored Markdown, code highlighting, and prose styles where those dependencies can be shared safely.
- Keeps the current locale, title, save status, and publication controls visible.
- Does not use a side-by-side pane, avoiding cramped editing and reducing mobile complexity.

### Locale Behavior

Payload's `English / 中文` content locale switch remains separate from the editor's `Edit / Preview` mode switch. Changing locale displays that locale's string and preview. Shared fields such as slug, publication date, read time, and tags do not duplicate between locales.

### Mobile Behavior

- Preview uses the full content width.
- Metadata panels move below the primary fields.
- Save and publish actions remain reachable through a sticky action area.
- Primary touch targets are at least 44px.

## State and Error Handling

### Dashboard

- Use skeletons matching the final card geometry while summaries load.
- A failed summary module renders its own compact error and retry action.
- A partial query failure must not blank the complete dashboard.
- Empty collections show a useful first-create action rather than a zero-only dead end.

### Editing and Saving

Clearly distinguish:

- `Unsaved`;
- `Saving…`;
- `Saved`;
- `Failed`.

Failed saves retain the current field value and provide a retry path. Existing Payload validation remains authoritative.

### Markdown Preview

If preview rendering fails:

- preserve the Markdown string;
- return the user to Edit mode;
- show a concise error near the editor;
- avoid replacing the document-level save state.

### Destructive Actions

Continue using Payload's native delete confirmation and access checks. Do not implement a second destructive-action flow.

## Accessibility

- Meet readable contrast in both themes for text, controls, statuses, and disabled states.
- Use the warm-yellow focus treatment with sufficient contrast and visible offset.
- All icon-only controls require an accessible name and tooltip.
- Keep navigation, mode switches, locale controls, forms, errors, and actions operable by keyboard.
- Use semantic status announcements for save and preview errors.
- Do not rely on color alone for draft, published, failed, or active states.
- Honor reduced-motion preferences.

## Component Boundaries

Keep custom components focused and independently testable:

- `AdminLogo` and `AdminIcon`: brand identity only.
- `AdminDashboard`: page composition and partial-state orchestration.
- Dashboard query helpers: bounded Payload Local API summaries.
- `SummaryCard`: one metric and its optional action.
- `RecentContent`: mixed recent-content list with stable links.
- `QuickCreate`: collection creation shortcuts.
- `MarkdownField`: Payload field binding and Edit/Preview state.
- `MarkdownToolbar`: string insertion commands.
- `MarkdownPreview`: rendered Markdown and preview error boundary.
- Admin theme stylesheet: scoped visual tokens and Payload component refinements.

No custom component should reproduce Payload authentication, permissions, document persistence, or collection routing.

## Testing and Verification

Automated coverage should include:

- dashboard summary aggregation and bounded recent-content ordering;
- dashboard partial failure and empty states;
- quick-create and recent-content route targets;
- Markdown Edit/Preview mode switching;
- localized Markdown values remaining isolated by locale;
- toolbar string insertion behavior;
- preview failure returning safely to Edit mode without data loss;
- theme tokens and critical admin layout hooks;
- key responsive structure for the dashboard and editor.

Completion verification includes:

- Payload type and import-map generation;
- TypeScript type checking;
- ESLint;
- the complete Vitest suite;
- a production Next.js build;
- manual inspection of Dashboard, Posts, Projects, Experiences, Site Settings, and Markdown preview;
- manual inspection in light and dark themes;
- manual inspection at desktop and mobile widths;
- keyboard navigation and reduced-motion smoke checks.

## Upgrade Safety

- Prefer documented Payload configuration and component slots.
- Keep selectors scoped under a dedicated admin root and avoid positional selectors tied to internal DOM depth.
- Do not copy Payload view implementations into the project.
- Regenerate the Payload import map after registering components.
- Record any unavoidable Payload class-level overrides in the admin stylesheet so they can be audited after dependency upgrades.

## Out of Scope

- Traffic analytics or content-performance charts.
- Team onboarding, roles beyond existing access behavior, review workflows, or approvals.
- Converting Markdown to Lexical rich text.
- Changing public content contracts or migration behavior.
- Adding database collections for dashboard summaries.
- Rebuilding Payload's collection lists, authentication, or document persistence.
