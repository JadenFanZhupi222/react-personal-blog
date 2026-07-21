import type { Locale } from '@/i18n/types';

export interface FeaturedProject {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

export interface FeaturedArticle {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  date: string;
  readTime: string;
}

export type HomeFeaturedContent = Record<
  Locale,
  {
    project: FeaturedProject | null;
    article: FeaturedArticle | null;
  }
>;
