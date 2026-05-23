import type { MetadataRoute } from 'next';
import { getAllBlogs, getAllTags } from '@/lib/blog/server';
import { SITE_URL } from '@/lib/constants/siteUrl';
import type { Locale } from '@/i18n/types';

const LOCALES: Locale[] = ['en', 'zh'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/home`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const blogs = await getAllBlogs();
  const blogListRoutes: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}/blog`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

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

  return [...staticRoutes, ...blogListRoutes, ...blogRoutes, ...tagRoutes];
}
