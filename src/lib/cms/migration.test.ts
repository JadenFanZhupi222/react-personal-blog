import { describe, expect, it } from 'vitest';
import { planLocalizedDocuments, retryTransient, withProjectMigrationKeys } from './migration';

describe('planLocalizedDocuments', () => {
  it('groups bilingual records under one stable key', () => {
    expect(
      planLocalizedDocuments([
        { slug: 'hello', language: 'en', title: 'Hello' },
        { slug: 'hello', language: 'zh', title: '你好' },
      ], 'slug')
    ).toEqual([{ key: 'hello', locales: { en: { slug: 'hello', language: 'en', title: 'Hello' }, zh: { slug: 'hello', language: 'zh', title: '你好' } } }]);
  });

  it('rejects duplicate keys within a locale', () => {
    expect(() => planLocalizedDocuments([
      { slug: 'same', language: 'en' },
      { slug: 'same', language: 'en' },
    ], 'slug')).toThrow('Duplicate legacy record: same (en)');
  });

  it('rejects unsupported locales and missing stable keys', () => {
    expect(() => planLocalizedDocuments([{ slug: 'x', language: 'fr' }], 'slug')).toThrow('Unsupported locale');
    expect(() => planLocalizedDocuments([{ language: 'en' }], 'slug')).toThrow('Missing migration key');
  });
});

describe('retryTransient', () => {
  it('retries transient MongoDB network errors', async () => {
    let attempts = 0;
    const result = await retryTransient(async () => {
      attempts += 1;
      if (attempts < 3) throw new Error('MongoNetworkError: connection closed');
      return 'ok';
    }, 3, 0);
    expect(result).toBe('ok');
    expect(attempts).toBe(3);
  });

  it('does not retry validation errors', async () => {
    let attempts = 0;
    await expect(retryTransient(async () => {
      attempts += 1;
      throw new Error('validation failed');
    }, 3, 0)).rejects.toThrow('validation failed');
    expect(attempts).toBe(1);
  });
});

describe('withProjectMigrationKeys', () => {
  it('borrows the matching localized project slug by order', () => {
    expect(withProjectMigrationKeys([
      { slug: 'portfolio', language: 'en', order: 1 },
      { language: 'zh', order: 1 },
    ])[1].slug).toBe('portfolio');
  });

  it('creates a deterministic fallback when no localized slug exists', () => {
    expect(withProjectMigrationKeys([{ language: 'zh', order: 4 }])[0].slug).toBe('legacy-project-4');
  });
});
