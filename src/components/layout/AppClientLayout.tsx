'use client';

import { TranslationsProvider } from '@/contexts/TranslationsContext';
import type { Translations, Locale } from '@/i18n/types';

export function AppClientProvider({
  translations,
  locale,
  children,
}: {
  translations: Translations;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <TranslationsProvider initialLocale={locale} initialTranslations={translations}>
      {children}
    </TranslationsProvider>
  );
}
