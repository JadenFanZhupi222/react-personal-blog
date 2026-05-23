import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/layout/Navbar';
import { AppClientProvider } from '@/components/layout/AppClientLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { UpdateNotification } from '@/components/UpdateNotification';
import { TopProgressBar } from '@/components/ui/TopProgressBar';
import { NavigationPendingProvider } from '@/contexts/NavigationPendingContext';
import { Toaster } from 'sonner';
import { APP_NAME, APP_DESCRIPTION } from '@/config/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { getTranslations } from '@/lib/translations/server';
import en from '@/i18n/locales/en';
import type { Locale, Translations } from '@/i18n/types';
import { SITE_URL } from '@/lib/constants/siteUrl';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${APP_NAME} RSS Feed` }],
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Locale-dependent UI lives here. Rendered once inside Suspense, once as the
// fallback. Provider-bearing pieces that emit scripts (next-themes) or hold
// state (react-query) live OUTSIDE this boundary so they don't get duplicated.
function LocalizedSection({
  locale,
  translations,
  children,
}: {
  locale: Locale;
  translations: Translations;
  children: React.ReactNode;
}) {
  return (
    <AppClientProvider translations={translations} locale={locale}>
      <div className="relative min-h-screen">
        <Navbar ssrTranslations={translations} />
        <main>{children}</main>
      </div>
      <UpdateNotification />
    </AppClientProvider>
  );
}

async function LocalizedRoot({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const preferred = cookieStore.get('preferred_locale')?.value;
  const locale: Locale = preferred === 'zh' ? 'zh' : 'en';
  const translations = getTranslations(locale);
  return (
    <LocalizedSection locale={locale} translations={translations}>
      {children}
    </LocalizedSection>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <NavigationPendingProvider>
              <TopProgressBar />
              <Suspense
                fallback={
                  <LocalizedSection locale="en" translations={en}>
                    {children}
                  </LocalizedSection>
                }
              >
                <LocalizedRoot>{children}</LocalizedRoot>
              </Suspense>
            </NavigationPendingProvider>
            <SpeedInsights />
            <Analytics />
            <Toaster position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
