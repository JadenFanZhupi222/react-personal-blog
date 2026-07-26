import type { CollectionConfig } from 'payload';
import { authenticated, publishedOrAuthenticated } from '@/lib/cms/access';
import { revalidateSource } from '@/lib/cms/hooks';

export const Posts: CollectionConfig = {
  slug: 'cms-posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'date', '_status'],
    group: 'Workspace',
    description: 'Write, localize, and publish long-form Markdown articles.',
  },
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
    {
      name: 'content',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Markdown with GFM and fenced code blocks.',
        components: {
          Field: '@/admin/markdown/MarkdownField#MarkdownField',
        },
        rows: 30,
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readTime',
      type: 'text',
      required: true,
      admin: { description: 'Displayed beside the publication date.', position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'array',
      admin: { position: 'sidebar' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
  ],
};
