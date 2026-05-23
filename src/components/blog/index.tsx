'use client';

import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useTranslations } from '@/lib/hooks/useTranslations';
import Link from 'next/link';
import type { Locale } from '@/i18n/types';
import type { Blog } from '@/lib/blog/types';
import { containerVariants, itemVariants } from '@/lib/animations';

interface BlogListPageProps {
  blogs: Blog[];
  locale: Locale;
  heading?: string;
  text?: string;
  emptyText?: string;
}

export function BlogListPage({ blogs, locale, heading, text, emptyText }: BlogListPageProps) {
  const { t } = useTranslations();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="min-h-[100dvh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <m.div variants={itemVariants}>
            <PageHeader heading={heading ?? t.blog.title} text={text ?? t.blog.description} />
          </m.div>
          {blogs.length === 0 ? (
            <m.p className="text-muted-foreground mt-12 text-center" variants={itemVariants}>
              {emptyText ?? ''}
            </m.p>
          ) : (
            <m.div className="mt-12 grid gap-6" variants={containerVariants}>
              {blogs.map((blog) => (
                <m.div key={blog.slug} variants={itemVariants}>
                  <Card className="group hover:border-primary-hover transition-colors">
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary-hover transition-colors hover:underline">
                        <Link href={`/${locale}/blog/${blog.slug}`}>{blog.title || 'No Title'}</Link>
                      </CardTitle>
                    </CardHeader>

                    <div className="text-muted-foreground mb-4 flex items-center gap-4 px-6 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {blog.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {blog.readTime}
                      </span>
                    </div>

                    <CardContent>
                      <p className="text-muted-foreground mb-4">{blog.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
                            className="hover:opacity-80"
                          >
                            <Badge icon>{tag}</Badge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </m.div>
              ))}
            </m.div>
          )}
        </div>
      </m.div>
    </LazyMotion>
  );
}
