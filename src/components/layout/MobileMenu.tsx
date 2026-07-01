import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { PendingLink } from '@/components/ui/PendingLink';
import type { Translations, Locale } from '@/i18n/types';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  mounted: boolean;
  t: Translations;
  pathname: string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export function MobileMenu({
  isOpen,
  setIsOpen,
  theme,
  setTheme,
  mounted,
  t,
  pathname,
  locale,
  setLocale,
}: MobileMenuProps) {
  const navItems = [
    { href: `/${locale}/home`, label: t.home.title },
    { href: `/${locale}/about`, label: t.about.title },
    { href: `/${locale}/projects`, label: t.projects.title },
    { href: `/${locale}/blog`, label: t.blog.title },
    { href: `/${locale}/contact`, label: t.contact.title },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="sticky top-0 z-50 w-full px-3 pt-2"
      >
        <div className="observatory-panel mx-auto w-full max-w-7xl rounded-xl py-4 backdrop-blur-xl">
          <nav className="flex flex-col gap-2 px-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <PendingLink
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_34%,transparent)]'
                      : 'text-foreground/72 hover:bg-accent/60 hover:text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </PendingLink>
              );
            })}
            <div className="mt-2 space-y-4 border-t border-border/70 pt-4">
              <div>
                <div className="text-foreground/70 mb-2 px-2 text-sm font-medium">
                  Language
                </div>
                <div className="space-y-1">
                  {[
                    { code: 'en' as const, name: 'English' },
                    { code: 'zh' as const, name: '中文' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center rounded-md px-2 py-2 transition-colors ${
                        locale === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-accent hover:text-primary'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-foreground/70 mb-2 px-2 text-sm font-medium">
                  Theme
                </div>
                <button
                  onClick={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light');
                    setIsOpen(false);
                  }}
                  className="hover:bg-primary-hover/30 text-foreground hover:text-primary flex w-full items-center space-x-2 rounded-md px-2 py-2 transition-colors"
                >
                  {mounted ? (
                    theme === 'light' ? (
                      <>
                        <Moon size={20} className="opacity-70" />
                        <span>Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <Sun size={20} className="opacity-70" />
                        <span>Light Mode</span>
                      </>
                    )
                  ) : null}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </motion.div>
    )
  );
}
