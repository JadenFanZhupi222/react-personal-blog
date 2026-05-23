import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Translations, Locale } from '@/i18n/types';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';
import Cookies from 'js-cookie';

const TRANSLATIONS: Record<Locale, Translations> = { en, zh };

interface TranslationsStoreState {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
}

export const useTranslationsStore = create<TranslationsStoreState>()(
  devtools((set) => ({
    locale: 'en',
    translations: TRANSLATIONS.en,
    setLocale: (locale) => {
      set({ locale, translations: TRANSLATIONS[locale] });
      Cookies.set('preferred_locale', locale, { path: '/', expires: 365 });
    },
  }))
);
