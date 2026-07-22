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
  access: { read: () => true, update: authenticated },
  hooks: { afterChange: [async ({ doc }) => revalidateSource('site-settings', doc)] },
  fields: [
    {
      name: 'skills', type: 'group', fields: [
        stringList('frontend', true), stringList('backend', true),
        stringList('devops', true), stringList('tools', true),
      ],
    },
    {
      name: 'github', type: 'group', fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'username', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
      ],
    },
    {
      name: 'emails', type: 'array', fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'email', required: true },
        { name: 'iconKey', type: 'text', required: true },
      ],
    },
    {
      name: 'socials', type: 'array', fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'iconKey', type: 'text', required: true },
      ],
    },
  ],
};
