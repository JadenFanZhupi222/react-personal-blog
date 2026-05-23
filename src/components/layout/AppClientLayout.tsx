'use client';

import { TranslationsProvider } from '@/contexts/TranslationsContext';
import type { Locale } from '@/i18n/types';

export function AppClientProvider({
  children,
  forcedLocale,
}: {
  children: React.ReactNode;
  forcedLocale?: Locale;
}) {
  return <TranslationsProvider forcedLocale={forcedLocale}>{children}</TranslationsProvider>;
}
