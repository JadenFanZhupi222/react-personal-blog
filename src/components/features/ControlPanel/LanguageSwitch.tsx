'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locale } from '@/i18n/types';
import { useRouter, usePathname } from 'next/navigation';

const languages: { code: Locale; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
];

const LOCALE_PREFIX = /^\/(en|zh)(\/.*)?$/;

export function LanguageSwitch() {
  const { locale, setLocale } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = async (newLocale: Locale) => {
    await setLocale(newLocale);
    // If we're on a locale-prefixed route (e.g. /en/blog/foo), swap the prefix
    // so the URL stays the source of truth for locale. Otherwise just refresh.
    const match = pathname.match(LOCALE_PREFIX);
    if (match) {
      const rest = match[2] ?? '';
      router.push(`/${newLocale}${rest}`);
    } else {
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-primary-foreground hover:bg-primary-hover/30 hover:text-primary-foreground inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent">
        <Globe size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-background/95">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={locale === lang.code ? 'bg-accent dark:bg-accent/50' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
