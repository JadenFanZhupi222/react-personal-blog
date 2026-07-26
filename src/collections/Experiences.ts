import type { CollectionConfig } from 'payload';
import { authenticated } from '@/lib/cms/access';
import { revalidateSource } from '@/lib/cms/hooks';

export const Experiences: CollectionConfig = {
  slug: 'cms-experiences',
  labels: { singular: 'Experience', plural: 'Experiences' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'startDate', 'order'],
    group: 'Workspace',
    description: 'Manage localized roles, achievements, and career dates.',
  },
  access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
  hooks: {
    afterChange: [async ({ doc }) => revalidateSource('experiences', doc)],
    afterDelete: [async ({ doc }) => revalidateSource('experiences', doc)],
  },
  fields: [
    { name: 'legacyKey', type: 'text', required: true, unique: true, index: true, admin: { hidden: true } },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'company', type: 'text', required: true, localized: true },
    { name: 'startDate', type: 'text', required: true, admin: { position: 'sidebar' } },
    { name: 'endDate', type: 'text', admin: { position: 'sidebar' } },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'achievements', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
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
