import { beforeAll, describe, expect, it, vi } from 'vitest';

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
});
