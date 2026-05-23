'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { Badge } from '@/components/ui/Badge';
import type { BlogContext, BlogSummary } from '@/lib/blog/parser';
import type { Locale } from '@/i18n/types';

interface FooterNavProps {
  context: BlogContext;
  locale: Locale;
}

function NavCard({
  blog,
  locale,
  label,
  direction,
}: {
  blog: BlogSummary;
  locale: Locale;
  label: string;
  direction: 'prev' | 'next';
}) {
  const align = direction === 'prev' ? 'items-start text-left' : 'items-end text-right';
  return (
    <Link
      href={`/${locale}/blog/${blog.slug}`}
      className={`group bg-card hover:border-primary-hover flex flex-col gap-2 rounded-xl border p-4 transition-colors ${align}`}
    >
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        {direction === 'prev' ? <ArrowLeft className="h-3.5 w-3.5" /> : null}
        {label}
        {direction === 'next' ? <ArrowRight className="h-3.5 w-3.5" /> : null}
      </span>
      <span className="text-foreground group-hover:text-primary-hover line-clamp-2 font-semibold transition-colors">
        {blog.title}
      </span>
    </Link>
  );
}

function RelatedCard({ blog, locale }: { blog: BlogSummary; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/blog/${blog.slug}`}
      className="group bg-card hover:border-primary-hover flex flex-col gap-2 rounded-xl border p-4 transition-colors"
    >
      <span className="text-foreground group-hover:text-primary-hover line-clamp-2 font-semibold transition-colors">
        {blog.title}
      </span>
      <div className="text-muted-foreground flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {blog.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {blog.readTime}
        </span>
      </div>
      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {blog.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  );
}

export function FooterNav({ context, locale }: FooterNavProps) {
  const { t } = useTranslations();
  const { prev, next, related } = context;
  if (!prev && !next && related.length === 0) return null;

  return (
    <section className="mx-auto mt-12 w-full max-w-3xl space-y-8">
      {(prev || next) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <NavCard blog={prev} locale={locale} label={t.blog.prev} direction="prev" />
          ) : (
            <div />
          )}
          {next ? (
            <NavCard blog={next} locale={locale} label={t.blog.next} direction="next" />
          ) : (
            <div />
          )}
        </div>
      )}
      {related.length > 0 && (
        <div>
          <h2 className="text-foreground mb-4 text-xl font-bold">{t.blog.related}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <RelatedCard key={r.slug} blog={r} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
