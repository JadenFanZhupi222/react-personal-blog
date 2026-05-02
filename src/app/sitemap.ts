import type { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/lib/blog/server';
import { SITE_URL } from '@/lib/constants/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/home`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const slugs = await getAllBlogSlugs();
  const seen = new Set<string>();
  const blogRoutes: MetadataRoute.Sitemap = slugs
    .filter(({ slug }) => {
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .map(({ slug }) => ({
      url: `${SITE_URL}/blog/${slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...blogRoutes];
}
