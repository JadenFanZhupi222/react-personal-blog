/**
 * Normalized site URL with guaranteed protocol and no trailing slash.
 *
 * NEXT_PUBLIC_APP_URL may be set as a bare host (e.g. "zhupi222.top") in
 * Vercel's env config. `new URL()` requires a protocol, so we prepend https://
 * if missing.
 */
function normalize(raw: string): string {
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, '');
}

export const SITE_URL = normalize(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
