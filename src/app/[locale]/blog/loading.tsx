import { SkeletonBlogList } from '@/components/skeleton/SkeletonBlogList';
import { PageHeader } from '@/components/layout/PageHeader';
import en from '@/i18n/locales/en';

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <PageHeader heading={en.blog.title} text={en.blog.description} />
      <SkeletonBlogList />
    </div>
  );
}
