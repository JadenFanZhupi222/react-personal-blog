import Link from 'next/link';
import type { HomeArticle } from './types';

interface LatestWritingProps {
  articles: HomeArticle[];
  locale: 'en' | 'zh';
  title: string;
  viewAll: string;
}

export function LatestWriting({ articles, locale, title, viewAll }: LatestWritingProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="latest-writing-title" className="border-t border-black/18 py-12 sm:py-16">
      <div className="mb-7 flex items-end justify-between gap-5 px-1">
        <h2 id="latest-writing-title" className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h2>
        <Link href={`/${locale}/blog`} className="border-b border-black/40 pb-1 text-sm font-bold transition-colors hover:border-[#d3a300] hover:text-[#a77f00]">{viewAll} →</Link>
      </div>
      <div className="border-y border-black/18">
        {articles.map((article, index) => (
          <Link key={article.slug} href={`/${locale}/blog/${article.slug}`} className="group grid min-h-28 grid-cols-[2.25rem_1fr_auto] items-center gap-4 border-b border-black/14 px-1 py-5 transition-colors last:border-b-0 hover:bg-black hover:px-5 hover:text-white sm:grid-cols-[3.5rem_1fr_auto] sm:gap-6">
            <span className="font-mono text-[10px] font-bold tracking-[0.12em] opacity-45">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-lg leading-tight font-black tracking-[-0.02em] sm:text-xl">{article.title}</span>
            <span className="hidden text-right font-mono text-[10px] font-bold tracking-[0.08em] opacity-55 sm:block">{article.date} · {article.readTime}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
