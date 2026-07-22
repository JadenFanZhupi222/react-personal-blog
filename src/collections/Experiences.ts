import type { CollectionConfig } from 'payload';
import { authenticated } from '@/lib/cms/access';
import { revalidateSource } from '@/lib/cms/hooks';

export const Experiences: CollectionConfig = {
  slug: 'cms-experiences',
  labels: { singular: 'Experience', plural: 'Experiences' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'company', 'startDate', 'order'] },
  access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
  hooks: {
    afterChange: [async ({ doc }) => revalidateSource('experiences', doc)],
    afterDelete: [async ({ doc }) => revalidateSource('experiences', doc)],
  },
  fields: [
    { name: 'legacyKey', type: 'text', required: true, unique: true, index: true, admin: { hidden: true } },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'company', type: 'text', required: true, localized: true },
    { name: 'startDate', type: 'text', required: true },
    { name: 'endDate', type: 'text' },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'achievements', type: 'array', localized: true, fields: [{ name: 'value', type: 'text', required: true }] },
    { name: 'order', type: 'number', required: true, defaultValue: 0, index: true },
  ],
};
