import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/layout/Navbar';
import { AppClientProvider } from '@/components/layout/AppClientLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { UpdateNotification } from '@/components/UpdateNotification';
import { Toaster } from 'sonner';
import { APP_NAME, APP_DESCRIPTION } from '@/config/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { getTranslations } from '@/lib/translations/server';
import type { Locale } from '@/i18n/types';
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve locale from the preferred_locale cookie so SSR HTML already has
  // the correct language. Avoids the English-flash on hydration for ZH users.
  const cookieStore = await cookies();
  const preferred = cookieStore.get('preferred_locale')?.value;
  const locale: Locale = preferred === 'zh' ? 'zh' : 'en';
  const translations = getTranslations(locale);

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} suppressHydrationWarning>
      <body className={inter.className}>
        <AppClientProvider translations={translations} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <div className="relative min-h-screen">
                <Navbar ssrTranslations={translations} />
                <main>{children}</main>
                <SpeedInsights />
                <Analytics />
              </div>
              <UpdateNotification />
              <Toaster position="top-center" />
            </QueryProvider>
          </ThemeProvider>
        </AppClientProvider>
      </body>
    </html>
  );
}
