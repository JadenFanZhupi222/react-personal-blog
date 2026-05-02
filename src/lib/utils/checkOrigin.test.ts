import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('checkOrigin', () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = ORIGINAL_ENV;
  });

  function makeRequest(origin: string | null) {
    return {
      headers: {
        get(name: string) {
          return name === 'origin' ? origin : null;
        },
      },
    } as unknown as import('next/server').NextRequest;
  }

  it('allows requests without an Origin header (server-side / same-origin)', async () => {
    const { checkOrigin } = await import('./checkOrigin');
    expect(checkOrigin(makeRequest(null))).toBeNull();
  });

  it('allows requests from the configured app URL', async () => {
    const { checkOrigin } = await import('./checkOrigin');
    expect(checkOrigin(makeRequest('https://example.com'))).toBeNull();
  });

  it('allows localhost origins for development', async () => {
    const { checkOrigin } = await import('./checkOrigin');
    expect(checkOrigin(makeRequest('http://localhost:3000'))).toBeNull();
    expect(checkOrigin(makeRequest('http://localhost:3001'))).toBeNull();
  });

  it('rejects unknown origins with 403', async () => {
    const { checkOrigin } = await import('./checkOrigin');
    const res = checkOrigin(makeRequest('https://evil.example.org'));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });

  it('rejects substring spoofing attempts', async () => {
    const { checkOrigin } = await import('./checkOrigin');
    // Attacker prepends allowed origin somewhere other than the start
    const res = checkOrigin(makeRequest('https://evil.com/?x=https://example.com'));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });
});
