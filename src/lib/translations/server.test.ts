import { describe, it, expect, vi, beforeEach } from 'vitest';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';

vi.mock('next/cache', () => ({
  cacheLife: () => undefined,
  cacheTag: () => undefined,
}));
vi.mock('@/lib/db', () => ({
  dbConnect: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/models/Translation', () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe('getTranslations', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns DB translations when locale exists in document', async () => {
    const dbZh = { ...zh, common: { ...zh.common, refresh: 'DB-刷新' } };
    const Translation = (await import('@/models/Translation')).default;
    (Translation.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({ zh: dbZh });

    const { getTranslations } = await import('./server');
    const result = await getTranslations('zh');
    expect(result.common.refresh).toBe('DB-刷新');
  });

  it('falls back to static translations when DB has no entry for the locale', async () => {
    const Translation = (await import('@/models/Translation')).default;
    (Translation.findOne as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { getTranslations } = await import('./server');
    const result = await getTranslations('en');
    expect(result).toEqual(en);
  });

  it('falls back to English when locale is unknown', async () => {
    const Translation = (await import('@/models/Translation')).default;
    (Translation.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { getTranslations } = await import('./server');
    const result = await getTranslations('fr');
    expect(result).toEqual(en);
  });

  it('falls back to static translations when DB throws', async () => {
    const Translation = (await import('@/models/Translation')).default;
    (Translation.findOne as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('boom'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getTranslations } = await import('./server');
    const result = await getTranslations('zh');
    expect(result).toEqual(zh);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
