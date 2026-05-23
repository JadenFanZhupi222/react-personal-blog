import { Blog } from './types';
import { Locale } from '@/i18n/types';

export function parseBlogs(raw: Blog[]): Record<Locale, Blog[]> {
  const grouped: Record<Locale, Blog[]> = { en: [], zh: [] };
  for (const blog of raw) {
    if (blog.language === 'en') {
      grouped.en.push(blog);
    } else if (blog.language === 'zh') {
      grouped.zh.push(blog);
    }
  }
  return grouped;
}

export interface BlogSummary {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  description: string;
  tags: string[];
}

export interface BlogContext {
  prev: BlogSummary | null;
  next: BlogSummary | null;
  related: BlogSummary[];
}

function toSummary(blog: Blog): BlogSummary {
  return {
    slug: blog.slug,
    title: blog.title,
    date: blog.date,
    readTime: blog.readTime,
    description: blog.description,
    tags: blog.tags,
  };
}

/**
 * Compute prev/next/related for a given slug within a list of blogs
 * already filtered to the same locale and sorted DESCENDING by date
 * (i.e., newest first — matches `BlogModel.find().sort({ date: -1 })`).
 * Related = up to `limit` other posts sharing at least one tag, scored by
 * overlap count then recency.
 */
export function computeBlogContext(
  slug: string,
  blogsDescByDate: Blog[],
  limit = 3
): BlogContext {
  const index = blogsDescByDate.findIndex((b) => b.slug === slug);
  if (index === -1) return { prev: null, next: null, related: [] };

  // List is newest-first, so the chronologically newer post sits at a LOWER index.
  const newer = index > 0 ? toSummary(blogsDescByDate[index - 1]) : null;
  const older = index < blogsDescByDate.length - 1 ? toSummary(blogsDescByDate[index + 1]) : null;

  const current = blogsDescByDate[index];
  const currentTags = new Set(current.tags || []);
  const related = blogsDescByDate
    .filter((b, i) => i !== index && (b.tags || []).some((t) => currentTags.has(t)))
    .map((b) => ({
      blog: b,
      overlap: (b.tags || []).filter((t) => currentTags.has(t)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ blog }) => toSummary(blog));

  return { prev: older, next: newer, related };
}

export function collectTags(blogs: Blog[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const b of blogs) {
    for (const t of b.tags || []) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
