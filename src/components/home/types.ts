import type { Locale } from '@/i18n/types';

export interface HomeProject {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  highlights: string[];
  url: string;
  order: number;
}

export interface HomeArticle {
  title: string;
  slug: string;
  date: string;
  readTime: string;
}

export type HomeFeaturedContent = Record<
  Locale,
  {
    projects: HomeProject[];
    articles: HomeArticle[];
  }
>;
