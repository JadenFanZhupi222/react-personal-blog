'use client';

import { Activity, Code, FolderGit2, User } from 'lucide-react';
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
    },
    {
      href: `/${locale}/projects`,
      icon: FolderGit2,
      title: t.home.features.projects.title,
      description: t.home.features.projects.description,
      actionText: t.home.features.projects.action,
    },
    {
      href: `/${locale}/blog`,
      icon: Code,
      title: t.home.features.blog.title,
      description: t.home.features.blog.description,
      actionText: t.home.features.blog.action,
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
        <main className="min-h-screen w-full px-4 py-8 md:px-8 lg:py-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            <m.section
              variants={itemVariants}
              className="editorial-panel overflow-hidden rounded-xl p-6 sm:p-9 lg:p-12"
            >
              <div className="text-primary mb-9 flex items-center gap-3">
                <span className="bg-primary h-2 w-2" />
                <span className="font-mono text-xs font-bold tracking-[0.16em]">
                  {t.home.title}
                </span>
              </div>
              <TextReveal
                as="h1"
                text={t.home.welcome}
                className="text-foreground max-w-5xl text-5xl leading-[0.9] font-black tracking-[-0.055em] text-balance sm:text-7xl xl:text-8xl"
              />
              <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 text-pretty">
                {t.home.description}
              </p>
              <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
                {featureCards.map((card) => (
                  <FeatureCard key={card.href} {...card} compact />
                ))}
              </div>
            </m.section>

            <m.section variants={itemVariants} className="border-border border-t py-8 sm:py-10">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-foreground flex items-center gap-2 text-2xl font-semibold tracking-[-0.02em]">
                  <Activity className="text-primary h-5 w-5" />
                  {t.home.activity.title}
                </h2>
                <div
                  aria-hidden="true"
                  className="from-primary/40 hidden h-px flex-1 bg-gradient-to-r to-transparent sm:block"
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
