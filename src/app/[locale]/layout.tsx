import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AppClientProvider } from '@/components/layout/AppClientLayout';
import { UpdateNotification } from '@/components/UpdateNotification';
import { getTranslations } from '@/lib/translations/server';
import type { Locale } from '@/i18n/types';

const SUPPORTED: Locale[] = ['en', 'zh'];

export function generateStaticParams(): { locale: Locale }[] {
  return SUPPORTED.map((locale) => ({ locale }));
}

// LocaleAwareNavbar is split out so we can wrap it in a Suspense boundary.
// Under Next.js 16 Cache Components, `await params` is treated as uncached
// dynamic data; pulling the locale read into a Suspense-able subtree lets
// the static shell prerender for routes with unknown dynamic segments below
// us (e.g. /[locale]/achievements/[appid] which has no generateStaticParams).
async function LocaleAwareNavbar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return notFound();
  const translations = getTranslations(locale);
  return <Navbar ssrTranslations={translations} />;
}

async function LocaleProvider({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  return <AppClientProvider forcedLocale={locale as Locale}>{children}</AppClientProvider>;
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense>
      <LocaleProvider params={params}>
        <div className="relative min-h-screen">
          <Suspense>
            <LocaleAwareNavbar params={params} />
          </Suspense>
          <main>{children}</main>
        </div>
        <UpdateNotification />
      </LocaleProvider>
    </Suspense>
  );
}
