import type { Locale } from '@/i18n/types';
import type { Experience, Skills } from '@/lib/about/types';
import type { Blog } from '@/lib/blog/types';
import type { ContactData } from '@/lib/contact/types';
import type { Project } from '@/lib/project/types';

type ValueItem = string | { value?: string | null };
type UnknownDocument = object;

function record(document: UnknownDocument): Record<string, unknown> {
  return document as Record<string, unknown>;
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function listValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item: ValueItem) => (typeof item === 'string' ? item : item?.value))
    .filter((item): item is string => typeof item === 'string');
}

export function mapPost(document: UnknownDocument, locale: Locale): Blog {
  const data = record(document);
  return {
    slug: stringValue(data.slug),
    title: stringValue(data.title),
    description: stringValue(data.description),
    content: stringValue(data.content),
    date: stringValue(data.date),
    readTime: stringValue(data.readTime),
    tags: listValue(data.tags),
    language: locale,
  };
}

export function mapProject(document: UnknownDocument, locale: Locale): Project {
  const data = record(document);
  return {
    slug: stringValue(data.slug),
    title: stringValue(data.title),
    description: stringValue(data.description),
    tags: listValue(data.tags),
    highlights: listValue(data.highlights),
    language: locale,
    url: stringValue(data.url),
    order: typeof data.order === 'number' ? data.order : 0,
  };
}

export function mapExperience(document: UnknownDocument): Experience {
  const data = record(document);
  return {
    title: stringValue(data.title),
    company: stringValue(data.company),
    startDate: stringValue(data.startDate),
    endDate: typeof data.endDate === 'string' ? data.endDate : null,
    description: stringValue(data.description),
    achievements: listValue(data.achievements),
  };
}

export function mapSiteSettings(document: UnknownDocument): { skills: Skills; contact: ContactData } {
  const data = record(document);
  const rawSkills = record((data.skills ?? {}) as object);
  return {
    skills: {
      frontend: listValue(rawSkills.frontend),
      backend: listValue(rawSkills.backend),
      devops: listValue(rawSkills.devops),
      tools: listValue(rawSkills.tools),
    },
    contact: {
      github: data.github as ContactData['github'],
      emails: (data.emails ?? []) as ContactData['emails'],
      socials: (data.socials ?? []) as ContactData['socials'],
    },
  };
}
