import type { Field, GlobalConfig } from 'payload';
import { authenticated } from '@/lib/cms/access';
import { revalidateSource } from '@/lib/cms/hooks';

function stringList(name: string, localized = false): Field {
  return {
    name,
    type: 'array',
    localized,
    fields: [{ name: 'value', type: 'text', required: true }],
  };
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Configuration',
    description: 'Shared skills, contact details, and social profiles.',
  },
  access: { read: () => true, update: authenticated },
  hooks: { afterChange: [async ({ doc }) => revalidateSource('site-settings', doc)] },
  fields: [
    {
      type: 'collapsible',
      label: 'Skills',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'skills', type: 'group', fields: [
            stringList('frontend', true), stringList('backend', true),
            stringList('devops', true), stringList('tools', true),
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'GitHub',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'github', type: 'group', fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'username', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Emails',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'emails',
          type: 'array',
          admin: {
            components: {
              RowLabel: '@/admin/rows/ContactRowLabel#ContactRowLabel',
            },
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'email', required: true },
            {
              name: 'iconKey',
              type: 'text',
              required: true,
              admin: { description: 'Icon identifier consumed by the public contact UI.' },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social profiles',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'socials',
          type: 'array',
          admin: {
            components: {
              RowLabel: '@/admin/rows/ContactRowLabel#ContactRowLabel',
            },
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
            {
              name: 'iconKey',
              type: 'text',
              required: true,
              admin: { description: 'Icon identifier consumed by the public contact UI.' },
            },
          ],
        },
      ],
    },
  ],
};
