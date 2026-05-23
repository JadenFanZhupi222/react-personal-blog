import type { Translations, Locale } from '@/i18n/types';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';

const TRANSLATIONS: Record<Locale, Translations> = { en, zh };

/**
 * Returns the translation bundle for a locale, falling back to English on any
 * unknown string. Translation copy lives in `src/i18n/locales/*` — there is no
 * runtime fetch, no database, no async.
 */
export function getTranslations(locale: string): Translations {
  return TRANSLATIONS[locale as Locale] ?? TRANSLATIONS.en;
}
