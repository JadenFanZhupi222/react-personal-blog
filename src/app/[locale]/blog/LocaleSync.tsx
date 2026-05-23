'use client';

import { useEffect } from 'react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import type { Locale } from '@/i18n/types';

/**
 * Syncs the active locale to the one embedded in the blog URL. Without this,
 * a user landing on /zh/blog/foo with cookie=en would see English UI strings
 * while the article itself is Chinese.
 */
export function BlogLocaleSync({ locale }: { locale: Locale }) {
  const { locale: current, setLocale } = useTranslations();
  useEffect(() => {
    if (current !== locale) setLocale(locale);
  }, [locale, current, setLocale]);
  return null;
}
