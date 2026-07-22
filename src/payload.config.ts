import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { Users } from '@/collections/Users';
import { Media } from '@/collections/Media';
import { Posts } from '@/collections/Posts';
import { Projects } from '@/collections/Projects';
import { Experiences } from '@/collections/Experiences';
import { SiteSettings } from '@/globals/SiteSettings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const databaseURL = process.env.DATABASE_URL ?? process.env.MONGODB_URI;
const payloadSecret = process.env.PAYLOAD_SECRET ?? (process.env.NODE_ENV === 'production' ? undefined : 'development-only-payload-secret-change-me');

if (!databaseURL) throw new Error('Missing DATABASE_URL or MONGODB_URI for Payload CMS');
if (!payloadSecret) throw new Error('Missing PAYLOAD_SECRET for Payload CMS');

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  routes: {
    admin: '/admin',
    api: '/cms-api',
    graphQL: '/cms-api/graphql',
    graphQLPlayground: '/cms-api/graphql-playground',
  },
  collections: [Users, Media, Posts, Projects, Experiences],
  globals: [SiteSettings],
  localization: { locales: ['en', 'zh'], defaultLocale: 'en', fallback: true },
  editor: lexicalEditor(),
  secret: payloadSecret,
  db: mongooseAdapter({ url: databaseURL }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
});
