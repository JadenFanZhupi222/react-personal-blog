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

  it('uses concise editorial copy for the main Chinese pages', () => {
    const translations = getTranslations('zh');

    expect(translations.home.welcome).toBe('技术文章、项目与开发实践');
    expect(translations.home.description).toBe('汇集软件开发中的项目成果、技术记录与问题复盘。');
    expect(translations.about.description).toBe('个人经历、专业技能与技术方向。');
    expect(translations.projects.description).toBe('已完成项目及其设计与实现。');
    expect(translations.blog.description).toBe('开发记录、技术分析与解决方案。');
    expect(translations.contact.description).toBe(
      '技术交流、项目合作及其他事项，可通过以下方式联系。'
    );
  });

  it('keeps the English copy factual and free of promotional language', () => {
    const translations = getTranslations('en');

    expect(translations.home.welcome).toBe('Technical writing, projects, and development work');
    expect(translations.projects.description).toBe(
      'Completed projects with notes on their design and implementation.'
    );
    expect(translations.blog.description).toBe(
      'Development notes, technical analysis, and practical solutions.'
    );
  });

  it('uses the same featured project order in both welcome locales', () => {
    expect(
      getTranslations('en').welcome.projects.items.map((project) => project.title)
    ).toEqual(['AI Photo Booth', 'Git Client', 'Family Meal Planner']);
    expect(
      getTranslations('zh').welcome.projects.items.map((project) => project.title)
    ).toEqual(['AI 拍照亭桌面应用', 'Git Client', '家庭食谱小程序']);
  });
});
