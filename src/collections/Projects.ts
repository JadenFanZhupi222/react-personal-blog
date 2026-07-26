import type { CollectionConfig } from 'payload';
import { authenticated } from '@/lib/cms/access';
import { revalidateSource } from '@/lib/cms/hooks';

export const Projects: CollectionConfig = {
  slug: 'cms-projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    group: 'Workspace',
    description: 'Maintain localized portfolio projects and their key outcomes.',
  },
  access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
  hooks: {
    afterChange: [async ({ doc }) => revalidateSource('projects', doc)],
    afterDelete: [async ({ doc }) => revalidateSource('projects', doc)],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea', required: true, localized: true },
    {
      name: 'tags',
      type: 'array',
      admin: { position: 'sidebar' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    { name: 'highlights', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'url', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      index: true,
      admin: { description: 'Lower values appear first.', position: 'sidebar' },
    },
  ],
};
