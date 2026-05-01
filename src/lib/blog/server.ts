import { cacheLife, cacheTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import BlogModel from '@/models/Blog';
import type { Locale } from '@/i18n/types';
import { parseBlogs } from './parser';
import type { Blog } from './types';

export async function getAllBlogs(): Promise<Record<Locale, Blog[]>> {
  'use cache';
  cacheLife('hours');
  cacheTag('blogs');
  await dbConnect();
  const blogs = (await BlogModel.find().sort({ date: -1 }).lean()) as unknown as Blog[];
  return parseBlogs(blogs);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(`blog-${slug}`);
  await dbConnect();
  return (await BlogModel.findOne({ slug }).lean()) as Blog | null;
}

export async function getAllBlogSlugs() {
  'use cache';
  cacheLife('minutes');
  cacheTag('blog-slugs');
  await dbConnect();
  const blogs = await BlogModel.find({}, { slug: 1, _id: 0 }).lean();
  return blogs.map((b) => ({ slug: b.slug as string }));
}
