import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogListPage } from '@/components/blog';
import { getAllBlogs } from '@/lib/blog/server';
import { SITE_URL } from '@/lib/constants/siteUrl';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';
import type { Locale } from '@/i18n/types';

const SUPPORTED: Locale[] = ['en', 'zh'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = locale === 'zh' ? zh : en;
  const url = `${SITE_URL}/${locale}/blog`;
  return {
    title: t.blog.title,
    description: t.blog.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/blog`,
        zh: `${SITE_URL}/zh/blog`,
      },
    },
    openGraph: {
      type: 'website',
      title: t.blog.title,
      description: t.blog.description,
      url,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function LocalizedBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return notFound();
  const blogs = await getAllBlogs();
  return <BlogListPage blogs={blogs[locale as Locale]} locale={locale as Locale} />;
}
