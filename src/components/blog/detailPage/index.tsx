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
    <div className="bg-background flex min-h-[100dvh] justify-center px-2 py-8">
      <div className="w-full max-w-3xl">
        <div className="bg-card dark:bg-card w-full rounded-2xl p-6 shadow-xl sm:p-10">
          <h1 className="text-foreground mb-2 text-center text-3xl leading-tight font-extrabold tracking-tight">
            {blog.title}
          </h1>
          <div className="text-muted-foreground mb-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {blog.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {blog.readTime}
            </span>
          </div>
          <div className="text-muted-foreground mb-4 text-center text-base">{blog.description}</div>
          {blog.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
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
          )}
          <div className="border-border mb-8 border-b border-dashed" />
          <article className="mx-auto max-w-none">
            <Markdown>{blog.content}</Markdown>
          </article>
        </div>
        <FooterNav context={context} locale={locale} />
      </div>
    </div>
  );
}
