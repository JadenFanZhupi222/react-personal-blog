import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { TopProgressBar } from '@/components/ui/TopProgressBar';
import { NavigationPendingProvider } from '@/contexts/NavigationPendingContext';
import { Toaster } from 'sonner';
import { APP_NAME, APP_DESCRIPTION } from '@/config/app';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { SITE_URL } from '@/lib/constants/siteUrl';


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
    { media: '(prefers-color-scheme: light)', color: '#f7f7f8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1d22' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Root layout is fully static. Locale lives in the URL ([locale] segment),
// so the locale-aware UI (Navbar, UpdateNotification, TranslationsProvider)
// is set up in src/app/[locale]/layout.tsx — not here. The bare welcome page
// at / has its own TranslationsProvider wrapper (cookie-based).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <NavigationPendingProvider>
              <TopProgressBar />
              {children}
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
