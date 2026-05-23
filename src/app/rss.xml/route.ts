import { getAllBlogs } from '@/lib/blog/server';
import { SITE_URL } from '@/lib/constants/siteUrl';
import { APP_NAME, APP_DESCRIPTION } from '@/config/app';
import type { Blog } from '@/lib/blog/types';

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function renderItem(blog: Blog): string {
  const url = `${SITE_URL}/${blog.language}/blog/${blog.slug}`;
  const categories = (blog.tags || [])
    .map((t) => `<category>${escapeXml(t)}</category>`)
    .join('');
  return `<item>
      <title>${escapeXml(blog.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(blog.date)}</pubDate>
      <description><![CDATA[${blog.description || ''}]]></description>
      ${categories}
    </item>`;
}

export async function GET() {
  const grouped = await getAllBlogs();
  // RSS readers do not differentiate locale — interleave both, sorted newest first.
  const all = [...grouped.en, ...grouped.zh].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = all.map(renderItem).join('\n    ');
  const lastBuildDate = all[0] ? toRfc822(all[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(APP_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(APP_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
