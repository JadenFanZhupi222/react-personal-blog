import { notFound } from 'next/navigation';
import { getBlogBySlug, getAllBlogSlugs } from '@/lib/blog/server';
import { BlogDetailContent } from '@/components/blog/detailPage';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllBlogSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return notFound();
  return <BlogDetailContent blog={blog} />;
}
