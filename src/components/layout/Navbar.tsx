'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LanguageSwitch } from '@/components/features/ControlPanel/LanguageSwitch';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { useMounted } from '@/lib/hooks/useMounted';
import ThemeSwitch from '@/components/features/ControlPanel/ThemeSwitch';
import { MobileMenu } from './MobileMenu';
import { PendingLink } from '@/components/ui/PendingLink';
import { Translations } from '@/i18n/types';

export function Navbar({ ssrTranslations }: { ssrTranslations: Translations }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [isOpen, setIsOpen] = React.useState(false);
  const { t: storeTranslations, locale, setLocale } = useTranslations();

  // Always use ssrTranslations as fallback
  const t = mounted && storeTranslations ? storeTranslations : ssrTranslations;

  // Hide navbar on the entrance page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="border-border bg-card text-foreground sticky top-0 z-50 w-full border-b backdrop-blur transition-colors">
      <div className="container flex h-14 items-center px-6 pr-1">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground hover:text-primary flex items-center transition-colors duration-200"
          >
            <span className="font-bold">Zhupi222</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <PendingLink
              href={`/${locale}/home`}
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              {t.home.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/about`}
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              {t.about.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/projects`}
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              {t.projects.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/blog`}
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              {t.blog.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/contact`}
              className="text-foreground/70 hover:text-primary transition-colors duration-200"
            >
              {t.contact.title}
            </PendingLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {/* Desktop controls */}
          <nav className="hidden items-center space-x-2 md:flex">
            {mounted && <LanguageSwitch />}
            <ThemeSwitch />
          </nav>
          {/* Mobile menu button */}
          <button
            className="text-foreground hover:bg-primary-hover/30 hover:scale-110 active:scale-95 active:duration-75 transition-transform duration-200 inline-flex items-center justify-center rounded-md p-2.5 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        theme={theme}
        setTheme={setTheme}
        mounted={mounted}
        t={t}
        locale={locale}
        setLocale={setLocale}
      />
    </nav>
  );
}
