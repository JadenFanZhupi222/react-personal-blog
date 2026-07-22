import { describe, expect, it } from 'vitest';
import { mapExperience, mapPost, mapProject, mapSiteSettings } from './mappers';

describe('Payload domain mappers', () => {
  it('maps a localized Payload post to the existing Blog contract', () => {
    expect(
      mapPost(
        {
          slug: 'payload',
          title: 'Payload 入门',
          description: '摘要',
          content: '# 正文',
          date: '2026-07-23T00:00:00.000Z',
          readTime: '5 min',
          tags: [{ value: 'cms' }],
        },
        'zh'
      )
    ).toEqual({
      slug: 'payload',
      title: 'Payload 入门',
      description: '摘要',
      content: '# 正文',
      date: '2026-07-23T00:00:00.000Z',
      readTime: '5 min',
      tags: ['cms'],
      language: 'zh',
    });
  });

  it('maps projects and experiences without leaking Payload metadata', () => {
    expect(
      mapProject(
        {
          slug: 'blog', title: '博客', description: '个人博客', url: 'https://example.com',
          order: 2, tags: [{ value: 'Next.js' }], highlights: [{ value: '双语' }],
        },
        'zh'
      )
    ).toMatchObject({ slug: 'blog', language: 'zh', tags: ['Next.js'], highlights: ['双语'] });

    expect(
      mapExperience({ title: '开发者', company: '公司', startDate: '2024-01', achievements: [{ value: '上线' }] })
    ).toEqual({
      title: '开发者', company: '公司', startDate: '2024-01', endDate: null,
      description: '', achievements: ['上线'],
    });
  });

  it('maps site settings to current skills and contact contracts', () => {
    expect(
      mapSiteSettings({
        skills: { frontend: [{ value: 'React' }], backend: [], devops: [], tools: [] },
        github: { label: 'GitHub', username: 'me', link: 'https://github.com/me' },
        emails: [{ label: 'Work', value: 'me@example.com' }],
        socials: [],
      })
    ).toEqual({
      skills: { frontend: ['React'], backend: [], devops: [], tools: [] },
      contact: {
        github: { label: 'GitHub', username: 'me', link: 'https://github.com/me' },
        emails: [{ label: 'Work', value: 'me@example.com' }],
        socials: [],
      },
    });
  });
});
