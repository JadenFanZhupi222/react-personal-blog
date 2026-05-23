import { NextRequest, NextResponse } from 'next/server';

// Redirect legacy /blog and /blog/* URLs (no locale segment) to /{cookieLocale}/blog/...
// Keeps existing bookmarks/sitemap entries working after the locale-prefixed restructure.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
  if (!isBlog) return NextResponse.next();

  const cookieLocale = request.cookies.get('preferred_locale')?.value;
  const locale = cookieLocale === 'zh' ? 'zh' : 'en';

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/blog', '/blog/:path*'],
};
