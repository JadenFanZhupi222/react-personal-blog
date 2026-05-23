'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';
import type { Locale, Translations } from '@/i18n/types';

const TRANSLATIONS: Record<Locale, Translations> = { en, zh };

interface TranslationsContextValue {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
}

const TranslationsContext = createContext<TranslationsContextValue | null>(null);

/**
 * Provides the active locale + translations to descendants. Server resolves the
 * locale (from the preferred_locale cookie) and passes it in as initial state,
 * so the very first paint is already correct — no English flash for ZH users.
 *
 * Mutations (LanguageSwitch) flow through setLocale, which updates Context
 * state and writes the cookie. No global store, no setState during render.
 */
export function TranslationsProvider({
  initialLocale,
  initialTranslations,
  children,
}: {
  initialLocale: Locale;
  initialTranslations: Translations;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Translations>(initialTranslations);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setTranslations(TRANSLATIONS[next]);
    Cookies.set('preferred_locale', next, { path: '/', expires: 365 });
  }, []);

  return (
    <TranslationsContext.Provider value={{ locale, translations, setLocale }}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslationsContext(): TranslationsContextValue {
  const ctx = useContext(TranslationsContext);
  if (!ctx) {
    throw new Error('useTranslations must be used within TranslationsProvider');
  }
  return ctx;
}
