import { Locale } from '@/i18n/types';

export interface Project {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  highlights: string[];
  language: Locale;
  url: string;
  order: number;
}
