import { BlogListPage } from '@/components/blog';
import { getAllBlogs } from '@/lib/blog/server';

export default async function BlogPage() {
  const blogs = await getAllBlogs();
  return <BlogListPage blogs={blogs} />;
}
