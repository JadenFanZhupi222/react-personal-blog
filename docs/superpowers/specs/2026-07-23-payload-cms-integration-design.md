# Payload CMS Integration Design

## Goal

Add a self-hosted Payload CMS admin experience to the existing Next.js application while retaining MongoDB, the public site design, Markdown rendering, bilingual content, and the ability to roll back to the existing Mongoose-backed content during migration.

## Chosen architecture

Payload will run inside the existing Next.js application and expose its admin panel at `/admin` plus its generated API under `/api`. The application will use Payload's MongoDB adapter, but Payload-managed content will live in new Payload collections rather than reusing the existing Mongoose collections in place. This prevents Payload schema metadata and localization changes from corrupting the current data and enables a controlled, verifiable migration.

The public site will read content through a small repository layer backed by Payload's Local API. Existing page and component contracts remain stable: repositories map Payload documents into the current `Blog`, `Project`, `AboutData`, and `ContactData` shapes. Steam, LeetCode, UI translations, animations, and contact submission behavior stay outside the CMS.

## Content model

### Posts

- Localized: `title`, `description`, and Markdown `content`
- Shared: unique `slug`, publication `date`, `readTime`, and `tags`
- Drafts and versions enabled
- Markdown remains plain text so the current renderer and code highlighting continue to work

### Projects

- Localized: `title`, `description`, and `highlights`
- Shared: unique `slug`, `tags`, `url`, and numeric `order`

### Experiences

- Localized: `title`, `company`, `description`, and `achievements`
- Shared: `startDate`, optional `endDate`, and `order`

### Site settings

- A Payload global stores localized skill groups and shared contact information
- Contact values remain structured arrays matching the current UI contracts

### Users and media

- `users` is an authenticated admin collection
- `media` supports future uploads; production storage is configurable separately

## Localization

Payload localization uses `en` and `zh`, with `en` as the default and fallback enabled. The existing site route locale is passed into queries explicitly. Migration groups old documents by stable identity (`slug` for posts and projects; an ordered identity for experiences) and writes their `language` variants into localized Payload fields.

## Migration and rollback

A TypeScript CLI supports `--dry-run`, execution, and verification. It reads the legacy collections without modifying them and upserts Payload content by stable keys. Verification compares source/target counts per locale and reports missing or duplicate keys. The legacy models and collections remain intact until the Payload-backed site has been validated; the code change can therefore be rolled back without restoring data.

The migration is intentionally idempotent: rerunning it updates matching target entries rather than duplicating them.

## Cache behavior

Existing server functions retain their public names and Next.js cache tags. Payload collection hooks call `revalidateTag` after content changes so published edits invalidate the relevant blog, project, about, or contact cache. RSS, sitemap, tag pages, previous/next navigation, and homepage content continue to consume the same repository functions.

## Security and configuration

- `PAYLOAD_SECRET` is required and server-only
- MongoDB continues through the existing connection URI, exposed to Payload as `DATABASE_URL` with a documented fallback during transition
- Only authenticated Payload users may create, update, or delete content
- Published content is publicly readable; drafts require an authenticated admin context
- Admin and API routes are excluded from locale proxy rewriting

## Error handling

Repository queries throw contextual errors for CMS failures rather than returning malformed content. Optional singleton data may return `null`, preserving current page behavior. Migration validates required fields before writes, prints item-level failures, and exits nonzero if any record fails.

## Testing and verification

- Unit tests cover mapping legacy and Payload document shapes, locale grouping, and idempotent migration planning
- Existing parser and component tests remain unchanged
- Type checking, linting, all Vitest tests, and a production build must pass
- A local smoke check confirms `/admin` is registered and the generated Payload types compile

## Out of scope

- Paid Payload Cloud services
- Migrating Steam or LeetCode data
- Replacing UI translation dictionaries
- Converting Markdown to Lexical rich text
- Deleting legacy MongoDB collections
- Provisioning production object storage
