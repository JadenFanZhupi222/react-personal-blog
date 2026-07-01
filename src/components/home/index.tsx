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
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <m.section
              variants={itemVariants}
              className="observatory-panel rounded-2xl p-6 sm:p-8 lg:p-10"
            >
              <div className="mb-8 flex items-center gap-3 text-primary">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
                <span className="font-mono text-xs">{t.home.title}</span>
              </div>
              <TextReveal
                as="h1"
                text={t.home.welcome}
                className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-6xl xl:text-7xl"
              />
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                {t.home.description}
              </p>
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {featureCards.map((card) => (
                  <FeatureCard key={card.href} {...card} compact />
                ))}
              </div>
            </m.section>

            <m.section
              variants={itemVariants}
              className="observatory-panel rounded-2xl p-5 sm:p-6 lg:p-8"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  <Activity className="h-5 w-5 text-primary" />
                  {t.home.activity.title}
                </h2>
                <div
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent sm:block"
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
