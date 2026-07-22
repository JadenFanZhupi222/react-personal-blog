export type CacheSource = 'posts' | 'projects' | 'experiences' | 'site-settings';

type CacheDocument = {
  slug?: string | null;
  tags?: Array<string | { value?: string | null }> | null;
};

function values(items: CacheDocument['tags']): string[] {
  return (items ?? [])
    .map((item) => (typeof item === 'string' ? item : item.value))
    .filter((item): item is string => Boolean(item));
}

export function cacheTagsForSource(source: CacheSource, document: CacheDocument = {}): string[] {
  if (source === 'projects') return ['projects'];
  if (source === 'experiences') return ['about'];
  if (source === 'site-settings') return ['about', 'contact'];

  const tags = ['blogs', 'blog-slugs', 'blog-tags'];
  if (document.slug) {
    tags.push(
      `blog-${document.slug}-en`,
      `blog-${document.slug}-zh`,
      `blog-context-en-${document.slug}`,
      `blog-context-zh-${document.slug}`
    );
  }
  tags.push(...values(document.tags).map((tag) => `blog-tag-${tag}`));
  return tags;
}

export function isMissingCacheContextError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('static generation store missing in revalidateTag');
}

export async function revalidateSource(source: CacheSource, document: CacheDocument = {}): Promise<void> {
  const { revalidateTag } = await import('next/cache');
  try {
    for (const tag of cacheTagsForSource(source, document)) revalidateTag(tag, 'max');
  } catch (error) {
    if (!isMissingCacheContextError(error)) throw error;
  }
}
