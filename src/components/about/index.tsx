'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { SkillCardList } from './SkillCard';
import { ExperienceCard } from './ExperienceCard';
import type { AboutData } from '@/lib/about/types';
import { containerVariants, itemVariants } from '@/lib/animations';

export function AboutContent({ data }: { data: AboutData }) {
  const { t, locale } = useTranslations();

  return (
    <LazyMotion features={domAnimation}>
      <m.div className="observatory-shell min-h-[100dvh]">
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <m.div initial="hidden" animate="visible" variants={itemVariants}>
            <PageHeader heading={t.about.title} text={t.about.description} />
          </m.div>
          <m.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-14"
          >
            <m.section variants={itemVariants} className="mt-16 space-y-6">
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">{t.about.skills.title}</h2>
              <SkillCardList skills={data.skills[locale] || null} />
            </m.section>

            <m.section variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                {t.about.experience.title}
              </h2>
              <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:hidden before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-primary/70 before:via-border before:to-transparent md:pl-10 md:before:block">
                {data.experiences[locale]?.map((exp, index) => (
                  <ExperienceCard key={index} exp={exp} index={index} />
                ))}
              </div>
            </m.section>
          </m.div>
        </div>
      </m.div>
    </LazyMotion>
  );
}
