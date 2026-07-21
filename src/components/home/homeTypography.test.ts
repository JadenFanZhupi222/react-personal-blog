import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const homeSource = readFileSync(join(process.cwd(), 'src/components/home/index.tsx'), 'utf8');
const homePageSource = readFileSync(join(process.cwd(), 'src/app/[locale]/home/page.tsx'), 'utf8');
const carouselSource = readFileSync(
  join(process.cwd(), 'src/components/home/HomeProjectCarousel.tsx'),
  'utf8'
);
const writingSource = readFileSync(
  join(process.cwd(), 'src/components/home/LatestWriting.tsx'),
  'utf8'
);

describe('home typography', () => {
  it('keeps the Chinese-friendly hero scale below the oversized 8xl treatment', () => {
    expect(homeSource).toContain('text-4xl');
    expect(homeSource).toContain('sm:text-5xl');
    expect(homeSource).toContain('lg:text-6xl');
    expect(homeSource).toContain('xl:text-7xl');
    expect(homeSource).not.toContain('xl:text-8xl');
  });

  it('uses a media-led hero and a manual three-project showcase', () => {
    expect(homeSource).toContain("from 'next/image'");
    expect(homeSource).toContain('/images/developer-editorial-hero.png');
    expect(homeSource).not.toContain('editorial-panel');
    expect(homeSource).toContain('HomeProjectCarousel');
    expect(homeSource).toContain('LatestWriting');
    expect(homeSource).not.toContain('FeatureCard');
    expect(homeSource).toContain('t.home.features.about.action');
    expect(homePageSource).toContain('getAllProjects');
    expect(homePageSource).toContain('getAllBlogs');
    expect(homePageSource).toContain("item.slug !== 'personal-homepage'");
    expect(homePageSource).toContain('.slice(0, 3)');
    expect(carouselSource).toContain('Swiper');
    expect(carouselSource).toContain('Keyboard');
    expect(carouselSource).toContain('A11y');
    expect(carouselSource).not.toContain('autoplay');
    expect(carouselSource).toContain('aria-live="polite"');
    expect(writingSource).toContain('/blog/${article.slug}');
  });
});
