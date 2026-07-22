import { cacheLife, cacheTag } from 'next/cache';
import type { Locale } from '@/i18n/types';
import { getCMS } from '@/lib/cms/client';
import { mapPost } from '@/lib/cms/mappers';
import { computeBlogContext, collectTags, type BlogContext } from './parser';
import type { Blog } from './types';

export async function getAllBlogs(): Promise<Record<Locale, Blog[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag('blogs');
  const cms = await getCMS();
  const locales: Locale[] = ['en', 'zh'];
  const entries = await Promise.all(locales.map(async (locale) => {
    const result = await cms.find({ collection: 'cms-posts', locale, fallbackLocale: false, sort: '-date', limit: 1000, overrideAccess: false });
    return result.docs.map((doc) => mapPost(doc, locale));
  }));
  return { en: entries[0], zh: entries[1] };
}

export async function getBlogBySlug(slug: string, language?: Locale): Promise<Blog | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-${slug}-${language ?? 'any'}`);
  const cms = await getCMS();
  const locale = language ?? 'en';
  const result = await cms.find({
    collection: 'cms-posts', locale, fallbackLocale: language ? 'en' : false,
    where: { slug: { equals: slug } }, limit: 1, overrideAccess: false,
  });
  return result.docs[0] ? mapPost(result.docs[0], locale) : null;
}

export async function getAllBlogSlugs(): Promise<{ slug: string }[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('blog-slugs');
  const cms = await getCMS();
  const result = await cms.find({ collection: 'cms-posts', locale: 'en', limit: 1000, overrideAccess: false });
  return result.docs.map(({ slug }) => ({ slug }));
}

export async function getBlogContext(slug: string, language: Locale): Promise<BlogContext> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-context-${language}-${slug}`);
  const cms = await getCMS();
  const result = await cms.find({ collection: 'cms-posts', locale: language, fallbackLocale: false, sort: '-date', limit: 1000, overrideAccess: false });
  const blogs = result.docs.map((doc) => mapPost(doc, language));
  return computeBlogContext(slug, blogs);
}

export async function getBlogsByTag(tag: string): Promise<Record<Locale, Blog[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-tag-${tag}`);
  const all = await getAllBlogs();
  return {
    en: all.en.filter((blog) => blog.tags.includes(tag)),
    zh: all.zh.filter((blog) => blog.tags.includes(tag)),
  };
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('blog-tags');
  const blogs = await getAllBlogs();
  return collectTags(blogs.en);
}
