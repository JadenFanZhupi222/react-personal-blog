import * as React from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Translations, Locale } from '@/i18n/types';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  mounted: boolean;
  t: Translations;
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
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
            <Link
              href="/home"
              className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.home.title}
            </Link>
            <Link
              href="/about"
              className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.about.title}
            </Link>
            <Link
              href="/projects"
              className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.projects.title}
            </Link>
            <Link
              href={`/${locale}/blog`}
              className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.blog.title}
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary-foreground text-primary-foreground/80 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.contact.title}
            </Link>
            <div className="space-y-4 border-t pt-4">
              <div>
                <div className="text-primary-foreground/80 mb-2 px-2 text-sm font-medium">
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
                          : 'hover:bg-primary-hover/30 text-primary-foreground hover:text-primary'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-primary-foreground/80 mb-2 px-2 text-sm font-medium">
                  Theme
                </div>
                <button
                  onClick={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light');
                    setIsOpen(false);
                  }}
                  className="hover:bg-primary-hover/30 text-primary-foreground hover:text-primary flex w-full items-center space-x-2 rounded-md px-2 py-2 transition-colors"
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
