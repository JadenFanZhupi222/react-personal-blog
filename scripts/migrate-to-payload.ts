import mongoose from 'mongoose';
import config from '../src/payload.config';
import { getPayload, type Payload } from 'payload';
import { planLocalizedDocuments, retryTransient, withProjectMigrationKeys } from '../src/lib/cms/migration';

type Locale = 'en' | 'zh';
type Legacy = Record<string, unknown> & { language?: Locale };

const dryRun = process.argv.includes('--dry-run');
const verifyOnly = process.argv.includes('--verify');
const databaseURL = process.env.MONGODB_URI ?? process.env.DATABASE_URL;
let activePayload: Payload | undefined;

if (!databaseURL) throw new Error('MONGODB_URI or DATABASE_URL is required');

const values = (items: unknown) => Array.isArray(items) ? items.map((value) => ({ value: String(value) })) : [];

async function upsertLocalized(
  payload: Payload,
  collection: 'cms-posts' | 'cms-projects' | 'cms-experiences',
  keyField: 'slug' | 'legacyKey',
  key: string,
  locales: Partial<Record<Locale, Legacy>>,
  toData: (record: Legacy, locale: Locale) => Record<string, unknown>
) {
  if (dryRun) return;
  const existing = await payload.find({ collection, where: { [keyField]: { equals: key } }, limit: 1, overrideAccess: true });
  let id = existing.docs[0]?.id;

  for (const locale of ['en', 'zh'] as const) {
    const record = locales[locale];
    if (!record) continue;
    const data = toData(record, locale);
    if (id) {
      await payload.update({ collection, id, locale, data: data as never, overrideAccess: true });
    } else {
      const created = await payload.create({ collection, locale, data: data as never, overrideAccess: true });
      id = created.id;
    }
  }
}

async function loadLegacy() {
  await mongoose.connect(databaseURL!, { serverSelectionTimeoutMS: 10_000 });
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection did not expose a database');
  const [blogs, projects, skillDocs, experienceDocs, contacts] = await Promise.all([
    db.collection<Legacy>('blogs').find({}).toArray(),
    db.collection<Legacy>('projects').find({}).toArray(),
    db.collection<Legacy>('skills').find({}).toArray(),
    db.collection<Legacy>('experiences').find({}).toArray(),
    db.collection<Legacy>('contacts').find({}).toArray(),
  ]);
  return { blogs, projects, skillDocs, experienceDocs, contact: contacts[0] };
}

async function verify(payload: Payload, expected: { posts: number; projects: number; experiences: number }) {
  const [posts, projects, experiences] = await Promise.all([
    payload.count({ collection: 'cms-posts', overrideAccess: true }),
    payload.count({ collection: 'cms-projects', overrideAccess: true }),
    payload.count({ collection: 'cms-experiences', overrideAccess: true }),
  ]);
  const summary = {
    posts: { expected: expected.posts, actual: posts.totalDocs },
    projects: { expected: expected.projects, actual: projects.totalDocs },
    experiences: { expected: expected.experiences, actual: experiences.totalDocs },
  };
  console.table(summary);
  if (Object.values(summary).some(({ expected, actual }) => expected !== actual)) throw new Error('Migration verification failed');
}

async function main() {
  const source = await retryTransient(loadLegacy, 3, 1500);
  const posts = planLocalizedDocuments(source.blogs, 'slug');
  const projects = planLocalizedDocuments(withProjectMigrationKeys(source.projects), 'slug');

  const expandedExperiences: Legacy[] = [];
  for (const languageDoc of source.experienceDocs) {
    if (languageDoc.language !== 'en' && languageDoc.language !== 'zh') continue;
    const experiences = Array.isArray(languageDoc.experiences) ? languageDoc.experiences : [];
    experiences.forEach((entry, index) => expandedExperiences.push({
      ...(entry as Record<string, unknown>), language: languageDoc.language,
      legacyKey: `${String((entry as Record<string, unknown>).startDate ?? 'unknown')}-${index}`,
      order: index,
    }));
  }
  const experiences = planLocalizedDocuments(expandedExperiences, 'legacyKey');
  const expected = { posts: posts.length, projects: projects.length, experiences: experiences.length };

  console.log(`Plan: ${posts.length} posts, ${projects.length} projects, ${experiences.length} experiences${dryRun ? ' (dry run)' : ''}`);
  if (dryRun) return;
  await mongoose.disconnect();
  const payload = await getPayload({ config });
  activePayload = payload;
  if (verifyOnly) return verify(payload, expected);

  for (const item of posts) await retryTransient(() => upsertLocalized(payload, 'cms-posts', 'slug', item.key, item.locales, (record) => ({
    title: record.title, slug: record.slug, description: record.description, content: record.content,
    date: record.date, readTime: record.readTime, tags: values(record.tags), _status: 'published',
  })));
  for (const item of projects) await retryTransient(() => upsertLocalized(payload, 'cms-projects', 'slug', item.key, item.locales, (record) => ({
    title: record.title, slug: record.slug, description: record.description, tags: values(record.tags),
    highlights: values(record.highlights), url: record.url, order: record.order ?? 0,
  })));
  for (const item of experiences) await retryTransient(() => upsertLocalized(payload, 'cms-experiences', 'legacyKey', item.key, item.locales, (record) => ({
    legacyKey: record.legacyKey, title: record.title, company: record.company, startDate: record.startDate,
    endDate: record.endDate, description: record.description, achievements: values(record.achievements), order: record.order ?? 0,
  })));

  if (!dryRun) {
    for (const locale of ['en', 'zh'] as const) {
      const skillsDoc = source.skillDocs.find((item) => item.language === locale);
      const skills = (skillsDoc?.skills ?? {}) as Record<string, unknown>;
      await retryTransient(() => payload.updateGlobal({
        slug: 'site-settings', locale, overrideAccess: true,
        data: {
          skills: {
            frontend: values(skills.frontend), backend: values(skills.backend),
            devops: values(skills.devops), tools: values(skills.tools),
          },
          ...(source.contact ? {
            github: source.contact.github,
            emails: source.contact.emails,
            socials: source.contact.socials,
          } : {}),
        } as never,
      }));
    }
    await verify(payload, expected);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (activePayload) await activePayload.destroy();
    else await mongoose.disconnect();
  });
