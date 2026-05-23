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

// Module-level pub/sub. setLocale writes the cookie and notifies subscribers
// so useSyncExternalStore re-reads. Keeps the cookie path working for
// non-locale-prefixed routes (e.g. the welcome page at /).
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

interface ProviderProps {
  children: React.ReactNode;
  /**
   * Authoritative locale from the URL ([locale] segment). When provided, the
   * cookie is ignored for the displayed locale — SSR + hydration both use this
   * value, so there's no flash. setLocale still writes the cookie so it acts
   * as a 'last seen preference' for non-localized entry points like /.
   */
  forcedLocale?: Locale;
}

/**
 * Provides locale + translations. Two modes:
 * - URL-localized (forcedLocale set): server renders with the right locale,
 *   client hydrates without re-rendering. Used everywhere under /[locale]/.
 * - Cookie-based (no forcedLocale): server renders EN, client switches to
 *   cookie locale via useSyncExternalStore. Used by the bare-/ welcome page.
 */
export function TranslationsProvider({ children, forcedLocale }: ProviderProps) {
  const cookieLocale = useSyncExternalStore(subscribe, readCookieLocale, serverLocale);
  const locale = forcedLocale ?? cookieLocale;
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
