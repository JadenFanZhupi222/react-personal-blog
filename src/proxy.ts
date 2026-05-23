import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'zh'] as const;
const LOCALIZED_TOP_LEVEL = ['home', 'about', 'projects', 'contact', 'blog', 'achievements'];

/**
 * Locale-aware redirect for bare paths. The site's actual routes live under
 * /[locale]/..., but we keep legacy/un-prefixed URLs working: e.g. /about
 * redirects to /{preferred_locale ?? 'en'}/about. Real /[locale]/... requests
 * pass through untouched.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);

  // Already locale-prefixed — pass through.
  if (
    segments.length > 0 &&
    (SUPPORTED_LOCALES as readonly string[]).includes(segments[0])
  ) {
    return NextResponse.next();
  }

  // Bare top-level localizable segment — redirect to localized variant.
  if (segments.length > 0 && LOCALIZED_TOP_LEVEL.includes(segments[0])) {
    const cookieLocale = request.cookies.get('preferred_locale')?.value;
    const locale = cookieLocale === 'zh' ? 'zh' : 'en';
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes, static files, RSS/sitemap.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|rss.xml|sitemap.xml|robots.txt).*)'],
};
