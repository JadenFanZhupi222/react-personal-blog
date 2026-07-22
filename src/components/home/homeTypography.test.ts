import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const homeSource = readFileSync(join(process.cwd(), 'src/components/home/index.tsx'), 'utf8');
const featureCardSource = readFileSync(
  join(process.cwd(), 'src/components/features/FeatureCard/index.tsx'),
  'utf8'
);
const homePageSource = readFileSync(
  join(process.cwd(), 'src/app/(frontend)/[locale]/home/page.tsx'),
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

  it('uses a media-led hero and real asymmetric featured content', () => {
    expect(homeSource).toContain("from 'next/image'");
    expect(homeSource).toContain('/images/developer-editorial-hero.png');
    expect(homeSource).not.toContain('editorial-panel');
    expect(homeSource).toContain('lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]');
    expect(homeSource).not.toContain('lg:grid-cols-3');
    expect(homeSource).toContain('t.home.features.about.action');
    expect(homeSource).toContain('/images/home/personal-blog-project.png');
    expect(homeSource).toContain('/images/home/family-recipe-code.png');
    expect(homePageSource).toContain('getAllProjects');
    expect(homePageSource).toContain('getAllBlogs');
    expect(featureCardSource).toContain("from 'next/image'");
    expect(featureCardSource).toContain('src={cover}');
    expect(featureCardSource).not.toContain('LucideIcon');
    expect(featureCardSource).not.toContain('index');
  });
});
