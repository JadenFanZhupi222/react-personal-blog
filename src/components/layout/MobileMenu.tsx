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
  locale,
  setLocale,
}: MobileMenuProps) {
  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border-primary/30 sticky top-0 z-50 w-full border-b"
      >
        <div className="container py-4">
          <nav className="flex flex-col space-y-4 px-6">
            <PendingLink
              href={`/${locale}/home`}
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.home.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/about`}
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.about.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/projects`}
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.projects.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/blog`}
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.blog.title}
            </PendingLink>
            <PendingLink
              href={`/${locale}/contact`}
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.contact.title}
            </PendingLink>
            <div className="space-y-4 border-t pt-4">
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
                          ? 'bg-primary/80 text-primary-foreground/90'
                          : 'hover:bg-primary-hover/30 text-foreground hover:text-primary'
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
