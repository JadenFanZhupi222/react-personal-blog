# Payload CMS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a free, self-hosted Payload admin panel and migrate the existing bilingual MongoDB content without changing the public site's UI contracts.

**Architecture:** Payload runs in the existing Next.js application with its MongoDB adapter and new managed collections. Focused adapters expose the current domain types to pages, while an idempotent CLI copies legacy Mongoose content into localized Payload documents and preserves the source collections for rollback.

**Tech Stack:** Next.js 16.2.6+, Payload CMS, TypeScript, MongoDB/Mongoose, Vitest, pnpm

---

### Task 1: Upgrade the framework and install Payload

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `next.config.ts`
- Modify: `tsconfig.json`

- [ ] Record the current test, typecheck, and build baseline.
- [ ] Upgrade Next.js to a Payload-supported 16.2.x release and install matching Payload packages, MongoDB adapter, editor, and image tooling.
- [ ] Wrap the existing Next config with `withPayload` without dropping cache or image settings.
- [ ] Add the generated Payload config alias to TypeScript paths.
- [ ] Run dependency and type checks and resolve only integration-related failures.

### Task 2: Define Payload configuration and content models

**Files:**
- Create: `src/payload.config.ts`
- Create: `src/collections/Users.ts`
- Create: `src/collections/Media.ts`
- Create: `src/collections/Posts.ts`
- Create: `src/collections/Projects.ts`
- Create: `src/collections/Experiences.ts`
- Create: `src/globals/SiteSettings.ts`
- Create: `src/lib/cms/access.ts`
- Create: `src/lib/cms/hooks.ts`
- Test: `src/lib/cms/hooks.test.ts`

- [ ] Write failing tests for cache-tag selection after each collection/global change.
- [ ] Run the focused test and confirm failure because the hook helpers do not exist.
- [ ] Implement focused access rules, cache invalidation helpers, collections, localization, drafts, and the site-settings global.
- [ ] Run the focused tests and generated Payload type task until they pass.

### Task 3: Mount the admin and generated API

**Files:**
- Create: `src/app/(payload)/layout.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/admin/importMap.js`
- Create: `src/app/(payload)/api/[...slug]/route.ts`
- Create: `src/app/(payload)/api/graphql/route.ts`
- Create: `src/app/(payload)/api/graphql-playground/route.ts`
- Modify: `src/proxy.ts`
- Test: `src/proxy.test.ts`

- [ ] Write a failing proxy test proving `/admin` and Payload API requests bypass locale routing.
- [ ] Run the focused test and confirm the new routes are not excluded.
- [ ] Add Payload's generated route shells and exclude CMS paths from the locale proxy.
- [ ] Run the focused proxy test and compile the mounted routes.

### Task 4: Add Payload-to-domain adapters

**Files:**
- Create: `src/lib/cms/client.ts`
- Create: `src/lib/cms/mappers.ts`
- Test: `src/lib/cms/mappers.test.ts`
- Modify: `src/lib/blog/server.ts`
- Modify: `src/lib/project/server.ts`
- Modify: `src/lib/about/server.ts`
- Modify: `src/lib/contact/server.ts`

- [ ] Write failing tests for post, project, experience, skill, and contact mapping in both locales.
- [ ] Run the mapper tests and confirm failure because the adapter functions are missing.
- [ ] Implement minimal pure mappers and a server-only Payload accessor.
- [ ] Replace Mongoose reads while preserving every existing exported function and cache tag.
- [ ] Run mapper, parser, page, RSS, and sitemap-related tests.

### Task 5: Build the legacy migration CLI

**Files:**
- Create: `scripts/migrate-to-payload.ts`
- Create: `src/lib/cms/migration.ts`
- Test: `src/lib/cms/migration.test.ts`
- Modify: `package.json`

- [ ] Write failing tests for duplicate detection, bilingual grouping, dry-run plans, and stable upsert keys.
- [ ] Run the focused migration test and confirm the planner is missing.
- [ ] Implement a pure migration planner, then the CLI database and Payload adapters.
- [ ] Add `cms:migrate`, `cms:migrate:dry-run`, and `cms:migrate:verify` scripts.
- [ ] Run the dry-run against configured development data without changing source collections.

### Task 6: Document configuration and verify the integration

**Files:**
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `.gitignore`

- [ ] Document `PAYLOAD_SECRET`, database configuration, first admin creation, migration commands, and media persistence.
- [ ] Run formatting on changed files.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm test:run`.
- [ ] Run `pnpm build` with required non-secret test environment values.
- [ ] Review `git diff`, ensure legacy collections are untouched, and commit only scoped files.
