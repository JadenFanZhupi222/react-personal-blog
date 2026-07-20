'use client';

import { Activity, Code, FolderGit2, User } from 'lucide-react';
import Image from 'next/image';
import { LeetCodeCard } from '@/components/home/LeetCodeCard';
import { SteamCard } from '@/components/home/SteamCard';
import { FeatureCard } from '@/components/features/FeatureCard';
import { TextReveal } from '@/components/effects/TextReveal';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';

export function HomePage() {
  const { t, locale } = useTranslations();
  const featureCards = [
    {
      href: `/${locale}/about`,
      icon: User,
      title: t.home.features.about.title,
      description: t.home.features.about.description,
      actionText: t.home.features.about.action,
      index: '01',
      cover: '/images/home/about-cover.png',
    },
    {
      href: `/${locale}/projects`,
      icon: FolderGit2,
      title: t.home.features.projects.title,
      description: t.home.features.projects.description,
      actionText: t.home.features.projects.action,
      index: '02',
      cover: '/images/home/projects-cover.png',
    },
    {
      href: `/${locale}/blog`,
      icon: Code,
      title: t.home.features.blog.title,
      description: t.home.features.blog.description,
      actionText: t.home.features.blog.action,
      index: '03',
      cover: '/images/home/writing-cover.png',
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="observatory-shell min-h-[100dvh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <main className="min-h-screen w-full pb-12">
          <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-0 px-3 pt-3 sm:px-5 sm:pt-5">
            <m.section
              variants={itemVariants}
              className="relative min-h-[36rem] overflow-hidden rounded-lg bg-black text-white sm:min-h-[42rem] lg:min-h-[46rem]"
            >
              <Image
                src="/images/developer-editorial-hero.png"
                alt="机械键盘、技术图纸和代码界面组成的开发工作台"
                fill
                priority
                sizes="(max-width: 1536px) 100vw, 1536px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_34%,rgba(0,0,0,0.12)_72%),linear-gradient(0deg,rgba(0,0,0,0.82)_0%,transparent_55%)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
                <div className="text-primary flex items-center gap-3">
                  <span className="bg-primary h-2 w-2" />
                  <span className="font-mono text-xs font-bold tracking-[0.16em]">
                    ZHUPI222 / {t.home.title}
                  </span>
                </div>
                <div>
                  <TextReveal
                    as="h1"
                    text={t.home.welcome}
                    className="max-w-4xl text-4xl leading-[0.93] font-black tracking-[-0.045em] text-balance text-white sm:text-5xl lg:text-6xl xl:text-7xl"
                  />
                  <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                    {t.home.description}
                  </p>
                </div>
              </div>
            </m.section>

            <m.section variants={itemVariants} className="py-12 sm:py-16">
              <div className="mb-7 flex items-end justify-between gap-4 px-1">
                <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  {t.home.features.projects.title} / {t.home.features.blog.title}
                </h2>
                <span className="text-muted-foreground hidden font-mono text-xs tracking-[0.16em] sm:block">
                  INDEX 01—03
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featureCards.map((card) => (
                  <FeatureCard key={card.href} {...card} />
                ))}
              </div>
            </m.section>

            <m.section
              variants={itemVariants}
              className="home-activity-shell rounded-lg bg-[#090909] p-5 text-white sm:p-8 lg:p-10"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-3xl font-black tracking-[-0.04em] text-white">
                  <Activity className="text-primary h-5 w-5" />
                  {t.home.activity.title}
                </h2>
                <div
                  aria-hidden="true"
                  className="from-primary/65 hidden h-px flex-1 bg-gradient-to-r to-transparent sm:block"
                />
              </div>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <LeetCodeCard />
                <SteamCard />
              </div>
            </m.section>
          </div>
        </main>
      </m.div>
    </LazyMotion>
  );
}
