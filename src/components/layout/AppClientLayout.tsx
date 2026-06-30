'use client';

import { usePathname } from 'next/navigation';
import { ReactBitsEffects } from '@/components/effects/ReactBitsEffects';
import { TranslationsProvider } from '@/contexts/TranslationsContext';
import type { Locale } from '@/i18n/types';

export function AppClientProvider({
  children,
  forcedLocale,
}: {
  children: React.ReactNode;
  forcedLocale?: Locale;
}) {
  const pathname = usePathname();

  return (
    <TranslationsProvider forcedLocale={forcedLocale}>
      <ReactBitsEffects pathname={pathname} />
      {children}
    </TranslationsProvider>
  );
}
