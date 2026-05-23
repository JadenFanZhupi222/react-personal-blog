import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
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
import en from '@/i18n/locales/en';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Layout is fully static — no cookies()/headers() at this level, so PPR can
  // prerender the whole shell. Locale is resolved client-side inside
  // TranslationsProvider (reads preferred_locale cookie on mount). ZH users
  // see a brief English flash on first paint/refresh; the trade-off is a
  // dynamic-free layout that doesn't block navigation.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <NavigationPendingProvider>
              <TopProgressBar />
              <AppClientProvider>
                <div className="relative min-h-screen">
                  <Navbar ssrTranslations={en} />
                  <main>{children}</main>
                </div>
                <UpdateNotification />
              </AppClientProvider>
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
