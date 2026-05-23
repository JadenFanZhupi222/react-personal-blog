'use client';

import { TranslationsProvider } from '@/contexts/TranslationsContext';

export function AppClientProvider({ children }: { children: React.ReactNode }) {
  return <TranslationsProvider>{children}</TranslationsProvider>;
}
