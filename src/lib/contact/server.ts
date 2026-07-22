import { cacheLife, cacheTag } from 'next/cache';
import { getCMS } from '@/lib/cms/client';
import { mapSiteSettings } from '@/lib/cms/mappers';
import type { ContactData } from './types';

export async function getContactData(): Promise<ContactData | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('contact');
  const cms = await getCMS();
  const settings = await cms.findGlobal({ slug: 'site-settings', locale: 'en', overrideAccess: false });
  return mapSiteSettings(settings).contact;
}
