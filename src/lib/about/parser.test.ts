import { describe, it, expect } from 'vitest';
import { parseAboutData } from './parser';
import type { Experience, RawAboutData, Skills } from './types';

const enSkills: Skills = { frontend: ['React'], backend: [], devops: [], tools: [] };
const zhSkills: Skills = { frontend: ['Vue'], backend: [], devops: [], tools: [] };

const exp = (overrides: Partial<Experience>): Experience => ({
  title: 't',
  company: 'c',
  startDate: '2020-01',
  endDate: null,
  description: '',
  achievements: [],
  ...overrides,
});

describe('parseAboutData', () => {
  it('separates skills by language', () => {
    const raw: RawAboutData = {
      skills: [
        { language: 'en', skills: enSkills },
        { language: 'zh', skills: zhSkills },
      ],
      experiences: [],
    };
    const out = parseAboutData(raw);
    expect(out.skills.en).toEqual(enSkills);
    expect(out.skills.zh).toEqual(zhSkills);
  });

  it('formats period and uses Present when endDate is missing', () => {
    const raw: RawAboutData = {
      skills: [],
      experiences: [
        {
          language: 'en',
          experiences: [
            exp({ startDate: '2022-03', endDate: '2024-06' }),
            exp({ startDate: '2024-07', endDate: null }),
          ],
        },
      ],
    };
    const out = parseAboutData(raw);
    const periods = out.experiences.en!.map((e) => e.period);
    expect(periods).toContain('2022.03 - 2024.06');
    expect(periods).toContain('2024.07 - Present');
  });

  it('sorts experiences by startDate descending within each language', () => {
    const raw: RawAboutData = {
      skills: [],
      experiences: [
        {
          language: 'en',
          experiences: [
            exp({ title: 'old', startDate: '2020-01' }),
            exp({ title: 'new', startDate: '2024-01' }),
            exp({ title: 'mid', startDate: '2022-01' }),
          ],
        },
      ],
    };
    const out = parseAboutData(raw);
    expect(out.experiences.en!.map((e) => e.title)).toEqual(['new', 'mid', 'old']);
  });
});
