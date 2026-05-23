import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/types';
import { BlogLocaleSync } from './LocaleSync';

const SUPPORTED: Locale[] = ['en', 'zh'];

export async function generateStaticParams(): Promise<{ locale: Locale }[]> {
  return SUPPORTED.map((locale) => ({ locale }));
}

export default async function BlogLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return notFound();
  return (
    <>
      <BlogLocaleSync locale={locale as Locale} />
      {children}
    </>
  );
}
