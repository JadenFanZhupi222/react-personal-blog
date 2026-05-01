import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Translations, Locale } from '@/i18n/types';
import { request } from '@/api/axios';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';
import { API_ERRORS } from '@/lib/constants/errors';
import Cookies from 'js-cookie';

interface TranslationsStoreState {
  locale: Locale;
  translations: Translations;
  loaded: Partial<Record<Locale, Translations>>;
  loading: boolean;
  error: string | null;
  setLocaleWithFetch: (locale: Locale) => Promise<void>;
}

const defaultTranslations: Record<Locale, Translations> = { en, zh };

export const useTranslationsStore = create<TranslationsStoreState>()(
  devtools((set, get) => ({
    locale: 'en',
    translations: defaultTranslations.en,
    loaded: {},
    loading: false,
    error: null,
    setLocaleWithFetch: async (locale: Locale) => {
      const loaded = get().loaded;
      if (loaded[locale]) {
        set({
          locale,
          translations: loaded[locale]!,
          loading: false,
        });
        Cookies.set('preferred_locale', locale, { path: '/', expires: 365 });
        return;
      }
      set({ error: null, loading: true });
      try {
        const translations = await request.get<Translations>(`/api/i18n?lang=${locale}`);
        set((state) => ({
          locale,
          translations,
          loaded: { ...state.loaded, [locale]: translations },
          loading: false,
        }));
        Cookies.set('preferred_locale', locale, { path: '/', expires: 365 });
      } catch (error) {
        set({
          locale,
          translations: defaultTranslations[locale] || defaultTranslations.en,
          loading: false,
          error: error instanceof Error ? error.message : API_ERRORS.MONGODB_ERROR,
        });
      }
    },
  }))
);
