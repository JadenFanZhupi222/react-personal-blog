import { cacheLife, cacheTag } from 'next/cache';
import type { Locale } from '@/i18n/types';
import { getCMS } from '@/lib/cms/client';
import { mapProject } from '@/lib/cms/mappers';
import type { Project } from './types';

export async function getAllProjects(): Promise<Record<Locale, Project[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects');
  const cms = await getCMS();
  const locales: Locale[] = ['en', 'zh'];
  const entries = await Promise.all(locales.map(async (locale) => {
    const result = await cms.find({ collection: 'cms-projects', locale, fallbackLocale: false, sort: 'order', limit: 1000, overrideAccess: false });
    return result.docs.map((doc) => mapProject(doc, locale));
  }));
  return { en: entries[0], zh: entries[1] };
}
