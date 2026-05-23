'use client';

import { useEffect } from 'react';
import { useTranslationsStore } from '@/store/translations';
import type { Locale } from '@/i18n/types';

/**
 * Syncs the zustand translations store to the locale embedded in the blog URL.
 * Without this, a user landing on /zh/blog/foo with cookie=en would see English
 * UI strings while the article itself is Chinese. setLocaleWithFetch is cached
 * per-locale so this is cheap to call on every navigation.
 */
export function BlogLocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    const current = useTranslationsStore.getState().locale;
    if (current !== locale) {
      void useTranslationsStore.getState().setLocaleWithFetch(locale);
    }
  }, [locale]);
  return null;
}
