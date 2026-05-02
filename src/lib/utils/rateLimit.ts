import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { HTTP_STATUS } from '@/api/config';

const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Sliding-window: 30 requests per minute per IP.
// Lazy-init so the module loads safely when Upstash env vars are absent
// (local dev without credentials, or CI builds with placeholder values).
let limiter: Ratelimit | null = null;
function getLimiter(): Ratelimit | null {
  if (!isConfigured) return null;
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'ratelimit:public-api',
    });
  }
  return limiter;
}

function getClientKey(req: NextRequest): string {
  // Vercel sets x-forwarded-for; fallback to a generic bucket if absent.
  const fwd = req.headers.get('x-forwarded-for');
  const ip = fwd?.split(',')[0]?.trim() || 'unknown';
  return ip;
}

/**
 * Returns a 429 NextResponse if the client is over the limit, or null if allowed.
 * No-ops (returns null) when Upstash env vars are not configured.
 */
export async function checkRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const rl = getLimiter();
  if (!rl) return null;

  const key = getClientKey(req);
  const { success, limit, remaining, reset } = await rl.limit(key);
  if (success) return null;

  return NextResponse.json(
    { error: 'Too many requests' },
    {
      status: HTTP_STATUS.TOO_MANY_REQUESTS,
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      },
    }
  );
}
