import { describe, it, expect } from 'vitest';
import { getTranslations } from './server';
import en from '@/i18n/locales/en';
import zh from '@/i18n/locales/zh';

describe('getTranslations', () => {
  it('returns the static English bundle', () => {
    expect(getTranslations('en')).toBe(en);
  });

  it('returns the static Chinese bundle', () => {
    expect(getTranslations('zh')).toBe(zh);
  });

  it('falls back to English for unknown locales', () => {
    expect(getTranslations('fr')).toBe(en);
  });
});
