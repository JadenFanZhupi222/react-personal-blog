'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BlogListPage } from '@/components/blog';
import { useTranslations } from '@/lib/hooks/useTranslations';
import type { Locale } from '@/i18n/types';
import type { Blog } from '@/lib/blog/types';

interface BlogTagPageProps {
  tag: string;
  locale: Locale;
  blogs: Blog[];
}

export function BlogTagPage({ tag, locale, blogs }: BlogTagPageProps) {
  const { t } = useTranslations();

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/blog`}
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.blog.backToList}
        </Link>
      </div>
      <BlogListPage
        blogs={blogs}
        locale={locale}
        heading={`${t.blog.taggedWith}: #${tag}`}
        text=""
        emptyText={t.blog.noPostsForTag}
      />
    </>
  );
}
