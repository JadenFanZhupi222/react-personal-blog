import { cacheLife, cacheTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import BlogModel from '@/models/Blog';
import type { Locale } from '@/i18n/types';
import { parseBlogs, computeBlogContext, collectTags, type BlogContext } from './parser';
import type { Blog } from './types';

export async function getAllBlogs(): Promise<Record<Locale, Blog[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag('blogs');
  await dbConnect();
  const blogs = await BlogModel.find({}, { _id: 0, __v: 0 }).sort({ date: -1 }).lean<Blog[]>();
  return parseBlogs(blogs);
}

export async function getBlogBySlug(slug: string, language?: Locale): Promise<Blog | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-${slug}-${language ?? 'any'}`);
  await dbConnect();
  if (language) {
    const exact = await BlogModel.findOne(
      { slug, language },
      { _id: 0, __v: 0 }
    ).lean<Blog>();
    if (exact) return exact;
  }
  // Fall back to any language version when locale-specific copy doesn't exist
  // (e.g. a user shares a zh URL with an en-only friend).
  return BlogModel.findOne({ slug }, { _id: 0, __v: 0 }).lean<Blog>();
}

export async function getAllBlogSlugs(): Promise<{ slug: string }[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('blog-slugs');
  await dbConnect();
  const blogs = await BlogModel.find({}, { slug: 1, _id: 0 }).lean<Pick<Blog, 'slug'>[]>();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function getBlogContext(slug: string, language: Locale): Promise<BlogContext> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-context-${language}-${slug}`);
  await dbConnect();
  const blogs = await BlogModel.find({ language }, { _id: 0, __v: 0, content: 0 })
    .sort({ date: -1 })
    .lean<Blog[]>();
  return computeBlogContext(slug, blogs);
}

export async function getBlogsByTag(tag: string): Promise<Record<Locale, Blog[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-tag-${tag}`);
  await dbConnect();
  const blogs = await BlogModel.find({ tags: tag }, { _id: 0, __v: 0, content: 0 })
    .sort({ date: -1 })
    .lean<Blog[]>();
  return parseBlogs(blogs);
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('blog-tags');
  await dbConnect();
  const blogs = await BlogModel.find({}, { tags: 1, _id: 0 }).lean<Pick<Blog, 'tags'>[]>();
  return collectTags(blogs as Blog[]);
}
