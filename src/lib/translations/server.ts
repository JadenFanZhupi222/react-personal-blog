import { cacheLife } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Translation, { TranslationDoc } from '@/models/Translation';
import type { Translations } from '@/i18n/types';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';

const staticTranslations = {
  en,
  zh,
};

export async function getTranslations(locale: string): Promise<Translations> {
  'use cache';
  cacheLife('hours');
  try {
    await dbConnect();
    const doc = (await Translation.findOne({})) as TranslationDoc | null;

    // If MongoDB has translations for the requested locale, use them
    if (doc && doc[locale]) {
      return doc[locale] as Translations;
    }

    // Silent fallback to static translations
    const fallbackLocale = locale in staticTranslations ? locale : 'en';
    return staticTranslations[fallbackLocale as keyof typeof staticTranslations];
  } catch (error) {
    // DB error: log once and fall back
    console.error('Failed to fetch translations from MongoDB:', error);
    const fallbackLocale = locale in staticTranslations ? locale : 'en';
    return staticTranslations[fallbackLocale as keyof typeof staticTranslations];
  }
}
