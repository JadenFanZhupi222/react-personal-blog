'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ExternalLink } from 'lucide-react';
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
          <m.div className="mt-12 grid gap-5 lg:grid-cols-2" variants={containerVariants}>
            {projects[locale]?.map((project: Project, index: number) => (
              <m.div
                key={index}
                variants={itemVariants}
                className={index === 0 ? 'lg:col-span-2' : ''}
              >
                <Card className="group bg-card hover:border-primary/70 h-full rounded-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="gap-4">
                    <CardTitle className="group-hover:text-primary-hover text-2xl tracking-[-0.025em] transition-colors">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <span className="inline-flex items-center gap-2">
                          {project.title}
                          <ExternalLink className="text-primary h-4 w-4" />
                        </span>
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-5 max-w-3xl leading-7">
                      {project.description}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          icon={false}
                          className="border-border bg-muted text-muted-foreground hover:border-primary hover:text-foreground border"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-primary font-semibold">{t.projects.highlights}</h3>
                      <ul className="text-muted-foreground space-y-2">
                        {project.highlights.map((highlight: string, i: number) => (
                          <li key={i} className="flex gap-3 leading-7">
                            <span className="bg-secondary mt-3 h-1.5 w-1.5 shrink-0 rounded-full" />
                            <span>{highlight}</span>
                          </li>
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
