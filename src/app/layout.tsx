import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
import en from '@/i18n/locales/en';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Layout is fully static — no cookies/headers access.
  // getTranslations is marked "use cache" so it's not "uncached data".
  // Client-side AppClientProvider handles locale preference from cookies.
  let translations = en;
  try {
    translations = await getTranslations('en');
  } catch {
    // fallback to static file on any error
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppClientProvider translations={translations}>
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
