import type { CollectionConfig } from 'payload';
import { authenticated } from '@/lib/cms/access';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Workspace',
    description: 'Upload and maintain reusable site imagery.',
  },
  upload: { imageSizes: [{ name: 'card', width: 1200, height: 675, position: 'centre' }] },
  access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
  fields: [{ name: 'alt', type: 'text', required: true, localized: true }],
};
