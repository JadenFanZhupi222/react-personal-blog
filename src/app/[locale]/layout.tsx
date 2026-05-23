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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return notFound();
  const translations = getTranslations(locale);
  return (
    <AppClientProvider forcedLocale={locale as Locale}>
      <div className="relative min-h-screen">
        <Navbar ssrTranslations={translations} />
        <main>{children}</main>
      </div>
      <UpdateNotification />
    </AppClientProvider>
  );
}
