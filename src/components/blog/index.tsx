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
            <m.div className="mt-12 grid gap-4" variants={containerVariants}>
              {blogs.map((blog) => (
                <m.div key={blog.slug} variants={itemVariants}>
                  <Card className="observatory-panel group rounded-xl bg-card/75 p-5 transition-colors hover:border-primary/45 sm:p-6">
                    <CardHeader className="mb-3">
                      <CardTitle className="text-2xl tracking-[-0.02em] transition-colors group-hover:text-primary-hover">
                        <Link
                          href={`/${locale}/blog/${blog.slug}`}
                          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {blog.title || 'No Title'}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-4 text-sm">
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
                      <p className="text-muted-foreground mb-5 max-w-3xl leading-7">
                        {blog.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
                            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Badge
                              icon
                              className="react-bits-shimmer border border-secondary/20 bg-secondary/12 text-foreground hover:text-secondary"
                            >
                              {tag}
                            </Badge>
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
