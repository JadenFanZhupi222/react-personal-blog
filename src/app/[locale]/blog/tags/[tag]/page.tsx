import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogsByTag, getAllTags } from '@/lib/blog/server';
import { BlogTagPage } from '@/components/blog/tagPage';
import { SITE_URL } from '@/lib/constants/siteUrl';
import type { Locale } from '@/i18n/types';

const SUPPORTED: Locale[] = ['en', 'zh'];

export async function generateStaticParams(): Promise<{ locale: Locale; tag: string }[]> {
  const tags = await getAllTags();
  const params: { locale: Locale; tag: string }[] = [];
  for (const locale of SUPPORTED) {
    for (const { tag } of tags) {
      params.push({ locale, tag });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const url = `${SITE_URL}/${locale}/blog/tags/${encodeURIComponent(tag)}`;
  return {
    title: `#${tag}`,
    description: `Posts tagged with ${tag}`,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/blog/tags/${encodeURIComponent(tag)}`,
        zh: `${SITE_URL}/zh/blog/tags/${encodeURIComponent(tag)}`,
      },
    },
    openGraph: {
      type: 'website',
      title: `#${tag}`,
      description: `Posts tagged with ${tag}`,
      url,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function LocalizedBlogTagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag: rawTag } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return notFound();
  const tag = decodeURIComponent(rawTag);
  const blogs = await getBlogsByTag(tag);
  const list = blogs[locale as Locale];
  if (list.length === 0) return notFound();
  return <BlogTagPage tag={tag} blogs={list} locale={locale as Locale} />;
}
