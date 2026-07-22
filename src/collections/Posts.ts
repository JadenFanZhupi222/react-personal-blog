import type { CollectionConfig } from 'payload';
import { authenticated, publishedOrAuthenticated } from '@/lib/cms/access';
import { revalidateSource } from '@/lib/cms/hooks';

export const Posts: CollectionConfig = {
  slug: 'cms-posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'date', '_status'] },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  hooks: {
    afterChange: [async ({ doc }) => revalidateSource('posts', doc)],
    afterDelete: [async ({ doc }) => revalidateSource('posts', doc)],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'content', type: 'textarea', required: true, localized: true, admin: { rows: 30 } },
    { name: 'date', type: 'date', required: true, index: true },
    { name: 'readTime', type: 'text', required: true },
    { name: 'tags', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
  ],
};
