'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Radio, X } from 'lucide-react';
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

  const navItems = [
    { href: `/${locale}/home`, label: t.home.title },
    { href: `/${locale}/about`, label: t.about.title },
    { href: `/${locale}/projects`, label: t.projects.title },
    { href: `/${locale}/blog`, label: t.blog.title },
    { href: `/${locale}/contact`, label: t.contact.title },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="sticky top-0 z-50 w-full px-3 pt-3 text-foreground">
      <div className="observatory-panel mx-auto flex h-14 w-full max-w-7xl items-center rounded-xl px-3 shadow-none backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-5">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2 rounded-md px-1 py-1 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Radio className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="truncate font-mono text-sm font-semibold tracking-normal">
              Zhupi222
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <PendingLink
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-lg px-3 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'text-primary'
                      : 'text-foreground/68 hover:bg-accent/55 hover:text-foreground'
                  }`}
                >
                  {active && (
                    <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
                  )}
                  <span className={active ? 'pl-3' : ''}>{item.label}</span>
                </PendingLink>
              );
            })}
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
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-foreground transition-all duration-200 hover:bg-accent hover:text-primary active:scale-95 active:duration-75 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
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
        pathname={pathname}
        locale={locale}
        setLocale={setLocale}
      />
    </nav>
  );
}
