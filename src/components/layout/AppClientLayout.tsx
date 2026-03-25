'use client';

import { useRef, useEffect } from 'react';
import { useTranslationsStore } from '@/store/translations';
import { useTranslations } from '@/lib/hooks/useTranslations';
import type { Translations, Locale } from '@/i18n/types';
import { GlobalLoading } from '@/components/layout/GlobalLoading';
import Cookies from 'js-cookie';

export function AppClientProvider({
  translations,
  children,
}: {
  translations: Translations;
  children: React.ReactNode;
}) {
  const { loading } = useTranslations();
  const hydrated = useRef(false);

  // Synchronously hydrate store with server-rendered English translations
  if (!hydrated.current) {
    useTranslationsStore.setState({
      locale: 'en',
      translations,
      loaded: { en: translations },
      loading: false,
      error: null,
    });
    hydrated.current = true;
  }

  // On mount: read preferred locale from cookie and switch if needed.
  // The existing setLocale() handles fetching + caching translations.
  useEffect(() => {
    const preferred = Cookies.get('preferred_locale') as Locale | undefined;
    if (preferred && preferred !== 'en') {
      useTranslationsStore.getState().setLocaleWithFetch(preferred);
    }
  }, []);

  return (
    <>
      {loading && <GlobalLoading />}
      {children}
    </>
  );
}
