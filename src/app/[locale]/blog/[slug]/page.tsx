import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getAllBlogs, getBlogContext } from '@/lib/blog/server';
import { BlogDetailContent } from '@/components/blog/detailPage';
import { SITE_URL } from '@/lib/constants/siteUrl';
import { APP_NAME } from '@/config/app';
import type { Locale } from '@/i18n/types';

const SUPPORTED: Locale[] = ['en', 'zh'];

export async function generateStaticParams(): Promise<{ locale: Locale; slug: string }[]> {
  const blogs = await getAllBlogs();
  const params: { locale: Locale; slug: string }[] = [];
  for (const locale of SUPPORTED) {
    for (const blog of blogs[locale]) {
      params.push({ locale, slug: blog.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return {};
  const blog = await getBlogBySlug(slug, locale as Locale);
  if (!blog) return {};

  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  const isoDate = new Date(blog.date).toISOString();

  return {
    title: blog.title,
    description: blog.description,
    keywords: blog.tags,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/blog/${slug}`,
        zh: `${SITE_URL}/zh/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.description,
      url,
      siteName: APP_NAME,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      publishedTime: isoDate,
      tags: blog.tags,
      authors: [APP_NAME],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
    },
  };
}

export default async function LocalizedBlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!SUPPORTED.includes(locale as Locale)) return notFound();
  const blog = await getBlogBySlug(slug, locale as Locale);
  if (!blog || blog.language !== locale) return notFound();
  const context = await getBlogContext(slug, locale as Locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    datePublished: new Date(blog.date).toISOString(),
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    keywords: blog.tags.join(', '),
    author: { '@type': 'Person', name: APP_NAME },
    publisher: { '@type': 'Person', name: APP_NAME },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${locale}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailContent blog={blog} context={context} locale={locale as Locale} />
    </>
  );
}
