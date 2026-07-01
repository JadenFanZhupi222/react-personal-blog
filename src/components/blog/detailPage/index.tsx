import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import Markdown from '@/components/features/Markdown';
import { Badge } from '@/components/ui/Badge';
import { FooterNav } from './FooterNav';
import type { Blog } from '@/lib/blog/types';
import type { BlogContext } from '@/lib/blog/parser';
import type { Locale } from '@/i18n/types';

interface BlogDetailContentProps {
  blog: Blog;
  context: BlogContext;
  locale: Locale;
}

export function BlogDetailContent({ blog, context, locale }: BlogDetailContentProps) {
  return (
    <div className="flex min-h-[100dvh] justify-center px-3 py-10 sm:py-14">
      <div className="w-full max-w-4xl">
        <div className="observatory-panel w-full rounded-2xl p-6 sm:p-10">
          <h1 className="text-balance text-center text-4xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl">
            {blog.title}
          </h1>
          <div className="text-muted-foreground mt-5 mb-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {blog.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {blog.readTime}
            </span>
          </div>
          <div className="mx-auto mb-5 max-w-2xl text-center text-base leading-7 text-muted-foreground">
            {blog.description}
          </div>
          {blog.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
                  className="hover:opacity-80"
                >
                <Badge
                  icon
                  className="border border-secondary/20 bg-secondary/12 text-foreground hover:text-secondary"
                >
                  {tag}
                </Badge>
                </Link>
              ))}
            </div>
          )}
          <div className="border-border/80 mb-8 border-b" />
          <article className="mx-auto max-w-none">
            <Markdown>{blog.content}</Markdown>
          </article>
        </div>
        <FooterNav context={context} locale={locale} />
      </div>
    </div>
  );
}
