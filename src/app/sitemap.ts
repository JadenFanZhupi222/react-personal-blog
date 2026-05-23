import type { MetadataRoute } from 'next';
import { getAllBlogs, getAllTags } from '@/lib/blog/server';
import { SITE_URL } from '@/lib/constants/siteUrl';
import type { Locale } from '@/i18n/types';

const LOCALES: Locale[] = ['en', 'zh'];

/** All static, locale-aware page slugs. */
const STATIC_PAGES: { slug: string; changeFrequency: 'monthly' | 'weekly' | 'yearly'; priority: number }[] = [
  { slug: 'home', changeFrequency: 'weekly', priority: 0.9 },
  { slug: 'about', changeFrequency: 'monthly', priority: 0.8 },
  { slug: 'projects', changeFrequency: 'weekly', priority: 0.8 },
  { slug: 'blog', changeFrequency: 'weekly', priority: 0.8 },
  { slug: 'achievements', changeFrequency: 'weekly', priority: 0.6 },
  { slug: 'contact', changeFrequency: 'yearly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PAGES.map(({ slug, changeFrequency, priority }) => ({
      url: `${SITE_URL}/${locale}/${slug}`,
      changeFrequency,
      priority,
    }))
  );

  const blogs = await getAllBlogs();
  const blogRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    blogs[locale].map((blog) => ({
      url: `${SITE_URL}/${locale}/blog/${blog.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  const tags = await getAllTags();
  const tagRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    tags.map(({ tag }) => ({
      url: `${SITE_URL}/${locale}/blog/tags/${encodeURIComponent(tag)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  );

  return [...root, ...staticRoutes, ...blogRoutes, ...tagRoutes];
}
