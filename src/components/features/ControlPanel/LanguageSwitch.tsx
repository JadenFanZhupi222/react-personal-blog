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

  const handleLanguageChange = (newLocale: Locale) => {
    // Always write the cookie so non-localized entry points (welcome /)
    // remember the preference for next visit.
    setLocale(newLocale);

    // Swap the locale prefix in the URL when applicable; on / (welcome) just
    // re-render via setLocale's notify path — no navigation needed.
    const match = pathname.match(LOCALE_PREFIX);
    if (match) {
      const rest = match[2] ?? '';
      router.push(`/${newLocale}${rest}`);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card-30 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-accent hover:text-primary active:scale-95 active:duration-75">
        <Globe size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-border bg-popover/95 backdrop-blur-xl">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={locale === lang.code ? 'bg-accent text-primary' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
