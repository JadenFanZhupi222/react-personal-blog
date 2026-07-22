import { cacheLife, cacheTag } from 'next/cache';
import { getCMS } from '@/lib/cms/client';
import { mapExperience, mapSiteSettings } from '@/lib/cms/mappers';
import type { Locale } from '@/i18n/types';
import type { AboutData, Experience } from './types';

export async function getAboutData(): Promise<AboutData> {
  'use cache';
  cacheLife('hours');
  cacheTag('about');
  const cms = await getCMS();
  const locales: Locale[] = ['en', 'zh'];
  const entries = await Promise.all(locales.map(async (locale) => {
    const [settings, result] = await Promise.all([
      cms.findGlobal({ slug: 'site-settings', locale, fallbackLocale: false, overrideAccess: false }),
      cms.find({ collection: 'cms-experiences', locale, fallbackLocale: false, sort: '-startDate', limit: 1000, overrideAccess: false }),
    ]);
    const experiences = result.docs.map(mapExperience).map((experience: Experience) => ({
      ...experience,
      period: `${experience.startDate.replace('-', '.')} - ${experience.endDate ? experience.endDate.replace('-', '.') : 'Present'}`,
    }));
    return { skills: mapSiteSettings(settings).skills, experiences };
  }));
  return {
    skills: { en: entries[0].skills, zh: entries[1].skills },
    experiences: { en: entries[0].experiences, zh: entries[1].experiences },
  };
}
