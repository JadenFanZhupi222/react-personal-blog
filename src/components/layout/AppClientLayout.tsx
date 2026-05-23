'use client';

import { useRef, useEffect } from 'react';
import { useTranslationsStore } from '@/store/translations';
import type { Translations, Locale } from '@/i18n/types';
import Cookies from 'js-cookie';

export function AppClientProvider({
  translations,
  locale,
  children,
}: {
  translations: Translations;
  locale: Locale;
  children: React.ReactNode;
}) {
  const hydrated = useRef(false);

  // Hydrate the zustand store with the locale/translations the server already
  // resolved (from the preferred_locale cookie). This must happen synchronously
  // during the first render so descendant components see the correct locale on
  // their very first paint — no English flash for ZH users.
  if (!hydrated.current) {
    useTranslationsStore.setState({ locale, translations });
    hydrated.current = true;
  }

  // Defensive cookie sync: if the client somehow has a stale or missing cookie,
  // bring it in line with what the server used. Cheap idempotent write.
  useEffect(() => {
    const current = Cookies.get('preferred_locale');
    if (current !== locale) {
      Cookies.set('preferred_locale', locale, { path: '/', expires: 365 });
    }
  }, [locale]);

  return <>{children}</>;
}
