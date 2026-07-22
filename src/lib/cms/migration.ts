import type { Locale } from '@/i18n/types';

type LegacyRecord = Record<string, unknown> & { language?: unknown };

export interface LocalizedMigrationDocument<T extends LegacyRecord> {
  key: string;
  locales: Partial<Record<Locale, T>>;
}

export function withProjectMigrationKeys<T extends LegacyRecord>(records: T[]): Array<T & { slug: string }> {
  const slugByOrder = new Map<unknown, string>();
  for (const record of records) {
    if (typeof record.slug === 'string' && record.slug) slugByOrder.set(record.order, record.slug);
  }
  return records.map((record, index) => ({
    ...record,
    slug: typeof record.slug === 'string' && record.slug
      ? record.slug
      : (slugByOrder.get(record.order) ?? `legacy-project-${String(record.order ?? index)}`),
  }));
}

export async function retryTransient<T>(
  operation: () => Promise<T>,
  attempts = 3,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      const transient = /MongoNetworkError|MongoServerSelectionError|connection .* closed|ECONNRESET/i.test(message);
      if (!transient || attempt === attempts) throw error;
      if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error('Retry loop exhausted');
}

export function planLocalizedDocuments<T extends LegacyRecord>(
  records: T[],
  keyField: string
): LocalizedMigrationDocument<T>[] {
  const grouped = new Map<string, LocalizedMigrationDocument<T>>();

  for (const record of records) {
    const key = record[keyField];
    if (typeof key !== 'string' || key.length === 0) throw new Error(`Missing migration key: ${String(keyField)}`);
    if (record.language !== 'en' && record.language !== 'zh') throw new Error(`Unsupported locale: ${String(record.language)}`);

    const existing = grouped.get(key) ?? { key, locales: {} };
    if (existing.locales[record.language]) throw new Error(`Duplicate legacy record: ${key} (${record.language})`);
    existing.locales[record.language] = record;
    grouped.set(key, existing);
  }

  return Array.from(grouped.values()).sort((a, b) => a.key.localeCompare(b.key));
}
