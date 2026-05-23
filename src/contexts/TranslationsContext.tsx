'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
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

// Module-level pub/sub so that setLocale anywhere in the tree forces every
// consumer to re-read the cookie. No useEffect/useState dance, no setState
// during render — useSyncExternalStore handles the SSR boundary cleanly.
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function readCookieLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  return Cookies.get('preferred_locale') === 'zh' ? 'zh' : 'en';
}
function serverLocale(): Locale {
  return 'en';
}

/**
 * Provides locale + translations. The SSR snapshot is always English so the
 * server-rendered shell is fully static (Next.js 16 PPR friendly). Once
 * hydration completes, useSyncExternalStore reads the preferred_locale cookie
 * — ZH users see a brief EN→ZH transition on first paint, but client-side
 * navigations don't flash since the value is stable across renders.
 *
 * Blog routes (locale in URL) call setLocale via BlogLocaleSync to align the
 * context with the URL.
 */
export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readCookieLocale, serverLocale);
  const translations = TRANSLATIONS[locale];

  const setLocale = useCallback((next: Locale) => {
    Cookies.set('preferred_locale', next, { path: '/', expires: 365 });
    listeners.forEach((l) => l());
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
