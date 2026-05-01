import { NextResponse } from 'next/server';
import { cacheLife, cacheTag } from 'next/cache';
import { API_CONFIG, API_ERROR_MESSAGES, HTTP_STATUS } from '@/api/config';
import type { NextRequest } from 'next/server';
import { checkOrigin } from '@/lib/utils/checkOrigin';

interface LeetcodeRequestBody {
  query: string;
  variables?: Record<string, unknown>;
}

async function getCachedLeetcodeData(body: LeetcodeRequestBody) {
  'use cache';
  cacheLife('hours');
  cacheTag('leetcode');
  const upstream = await fetch(API_CONFIG.LEETCODE.BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!upstream.ok) {
    throw new Error(`LeetCode upstream failed: ${upstream.status}`);
  }
  return upstream.json();
}

export async function POST(requestObj: NextRequest) {
  const originError = checkOrigin(requestObj);
  if (originError) return originError;

  try {
    const body = (await requestObj.json()) as LeetcodeRequestBody;

    // Whitelist: only allow our own stats query
    if (typeof body?.query !== 'string' || !body.query.includes('matchedUser')) {
      return NextResponse.json({ error: API_ERROR_MESSAGES.FORBIDDEN }, { status: HTTP_STATUS.FORBIDDEN });
    }

    const data = await getCachedLeetcodeData(body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('LeetCode API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : API_ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: API_ERROR_MESSAGES.FORBIDDEN },
    { status: HTTP_STATUS.FORBIDDEN }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: API_ERROR_MESSAGES.FORBIDDEN },
    { status: HTTP_STATUS.FORBIDDEN }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: API_ERROR_MESSAGES.FORBIDDEN },
    { status: HTTP_STATUS.FORBIDDEN }
  );
}
