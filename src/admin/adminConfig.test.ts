import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { Field } from 'payload';

let config: Awaited<typeof import('@/payload.config').default>;

beforeAll(async () => {
  vi.stubEnv('DATABASE_URL', 'mongodb://localhost:27017/payload-admin-test');
  config = await import('@/payload.config').then((module) => module.default);
}, 60_000);

describe('Payload admin UI configuration', () => {
  it('registers branded graphics and a custom dashboard view', () => {
    expect(config.admin?.components?.graphics).toEqual({
      Icon: '@/admin/branding/AdminIcon#AdminIcon',
      Logo: '@/admin/branding/AdminLogo#AdminLogo',
    });
    expect(config.admin?.components?.views?.dashboard?.Component).toBe(
      '@/admin/dashboard/AdminDashboard#AdminDashboard',
    );
  });

  it('groups routine content separately from administration', () => {
    expect(collection('cms-posts').admin.group).toBe('Workspace');
    expect(collection('cms-projects').admin.group).toBe('Workspace');
    expect(collection('cms-experiences').admin.group).toBe('Workspace');
    expect(collection('media').admin.group).toBe('Workspace');
    expect(collection('users').admin.group).toBe('Administration');
    expect(global('site-settings').admin.group).toBe('Configuration');
  });

  it('places shared document metadata in the sidebar', () => {
    expect(field('cms-posts', 'date').admin?.position).toBe('sidebar');
    expect(field('cms-posts', 'readTime').admin?.position).toBe('sidebar');
    expect(field('cms-posts', 'tags').admin?.position).toBe('sidebar');

    expect(field('cms-projects', 'url').admin?.position).toBe('sidebar');
    expect(field('cms-projects', 'order').admin?.position).toBe('sidebar');
    expect(field('cms-projects', 'tags').admin?.position).toBe('sidebar');

    expect(field('cms-experiences', 'startDate').admin?.position).toBe('sidebar');
    expect(field('cms-experiences', 'endDate').admin?.position).toBe('sidebar');
    expect(field('cms-experiences', 'order').admin?.position).toBe('sidebar');
  });

  it('presents site settings in readable collapsible sections', () => {
    const sections = global('site-settings').fields
      .filter((candidate) => candidate.type === 'collapsible')
      .map((candidate) => candidate.label);

    expect(sections).toEqual(['Skills', 'GitHub', 'Emails', 'Social profiles']);
    expect(arrayField('site-settings', 'emails').admin?.components?.RowLabel).toBe(
      '@/admin/rows/ContactRowLabel#ContactRowLabel',
    );
    expect(arrayField('site-settings', 'socials').admin?.components?.RowLabel).toBe(
      '@/admin/rows/ContactRowLabel#ContactRowLabel',
    );
  });
});

function collection(slug: string) {
  const result = config.collections?.find((candidate) => candidate.slug === slug);
  if (!result) throw new Error(`Missing collection: ${slug}`);
  return result;
}

function global(slug: string) {
  const result = config.globals?.find((candidate) => candidate.slug === slug);
  if (!result) throw new Error(`Missing global: ${slug}`);
  return result;
}

function flatten(fields: Field[]): Field[] {
  return fields.flatMap((candidate) =>
    'fields' in candidate && Array.isArray(candidate.fields)
      ? [candidate, ...flatten(candidate.fields)]
      : [candidate],
  );
}

function field(containerSlug: string, fieldName: string, isGlobal = false) {
  const fields = isGlobal ? global(containerSlug).fields : collection(containerSlug).fields;
  const result = flatten(fields).find(
    (candidate) => 'name' in candidate && candidate.name === fieldName,
  );
  if (!result || !('admin' in result)) {
    throw new Error(`Missing field: ${containerSlug}.${fieldName}`);
  }
  return result;
}

function arrayField(containerSlug: string, fieldName: string) {
  const result = field(containerSlug, fieldName, true);
  if (result.type !== 'array') throw new Error(`Expected array field: ${containerSlug}.${fieldName}`);
  return result;
}
