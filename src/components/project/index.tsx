'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { Badge } from '@/components/ui/Badge';
import type { Locale } from '@/i18n/types';
import type { Project } from '@/lib/project/types';
import { containerVariants, itemVariants } from '@/lib/animations';

export function ProjectListPage({ projects }: { projects: Record<Locale, Project[]> }) {
  const { t, locale } = useTranslations();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="min-h-[100dvh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <m.div variants={itemVariants}>
            <PageHeader heading={t.projects.title} text={t.projects.description} />
          </m.div>
          <m.div className="mt-12 grid gap-6" variants={containerVariants}>
            {projects[locale]?.map((project: Project, index: number) => (
              <m.div key={index} variants={itemVariants}>
                <Card className="group hover:border-primary-hover transition-colors">
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary-hover transition-colors hover:underline">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        {project.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <Badge key={tag} icon={false}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{t.projects.highlights}:</h3>
                      <ul className="text-muted-foreground list-inside list-disc space-y-1">
                        {project.highlights.map((highlight: string, i: number) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </m.div>
        </div>
      </m.div>
    </LazyMotion>
  );
}
