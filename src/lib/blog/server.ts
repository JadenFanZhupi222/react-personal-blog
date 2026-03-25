import { cacheLife, cacheTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import BlogModel from '@/models/Blog';
import type { Blog } from './types';

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
