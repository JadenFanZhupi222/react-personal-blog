import { NextRequest, NextResponse } from 'next/server';
import { HTTP_STATUS } from '@/api/config';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

/**
 * Validates that the request originates from our own site.
 * Returns a 403 NextResponse if rejected, or null if allowed.
 *
 * Rules:
 *  - No Origin header → allowed (SSR / same-origin GET requests)
 *  - Origin matches an allowed origin → allowed
 *  - Otherwise → 403 Forbidden
 */
export function checkOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin');
  if (!origin) return null; // server-side or same-origin

  const isAllowed = ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
  if (isAllowed) return null;

  return NextResponse.json({ error: 'Forbidden' }, { status: HTTP_STATUS.FORBIDDEN });
}
