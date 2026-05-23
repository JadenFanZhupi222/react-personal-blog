'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { ControlPanel } from '@/components/features/ControlPanel';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function Welcome() {
  const { t, locale } = useTranslations();

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen overflow-y-auto">
        {/* 语言切换按钮 */}
        <ControlPanel />

        {/* Hero Section */}
        <ParallaxSection>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-sm space-y-6 text-center sm:max-w-none sm:space-y-8"
          >
            <m.div
              className="space-y-2"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <h1 className="text-welcome-gradient-foreground text-4xl leading-tight font-bold drop-shadow-sm sm:text-6xl md:text-7xl">
                {t.welcome.name}
              </h1>
              <h2 className="text-welcome-gradient-foreground text-3xl font-bold drop-shadow-sm sm:text-5xl md:text-6xl">
                {t.welcome.nickname}
              </h2>
            </m.div>

            <m.p
              className="text-welcome-gradient-foreground flex flex-col items-center justify-center gap-2 text-lg sm:flex-row sm:gap-4 sm:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span>{t.welcome.role.fullstack}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t.welcome.role.tech}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t.welcome.role.game}</span>
            </m.p>

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-4"
            >
              <Link
                href={`/${locale}/home`}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary inline-flex h-12 items-center justify-center rounded-lg px-8 text-lg font-semibold shadow-md transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {t.welcome.enter}
              </Link>
            </m.div>
          </m.div>
        </ParallaxSection>

        {/* Tech Stack Section */}
        <ParallaxSection>
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-welcome-gradient-foreground mb-8 text-4xl font-bold drop-shadow-sm">
              {t.welcome.techStack.title}
            </h2>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {t.welcome.techStack.items.map((tech) => (
                <div
                  key={tech}
                  className="border-border bg-card text-card-foreground rounded-lg border p-6 shadow backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/10"
                >
                  <h3 className="text-welcome-gradient-foreground text-xl font-semibold">{tech}</h3>
                </div>
              ))}
            </div>
          </m.div>
        </ParallaxSection>

        {/* Projects Section */}
        <ParallaxSection>
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-welcome-gradient-foreground mb-8 text-4xl font-bold drop-shadow-sm">
              {t.welcome.projects.title}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {t.welcome.projects.items.map((project) => (
                <div
                  key={project.title}
                  className="border-border bg-card text-card-foreground rounded-lg border p-8 shadow backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/10"
                >
                  <h3 className="text-welcome-gradient-foreground mb-4 text-2xl font-semibold">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>
          </m.div>
        </ParallaxSection>

        {/* Contact Section */}
        <ParallaxSection>
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-welcome-gradient-foreground mb-8 text-4xl font-bold drop-shadow-sm">
              {t.welcome.contact.title}
            </h2>
            <div className="mx-auto max-w-2xl">
              <p className="text-muted-foreground mb-8 text-xl">{t.welcome.contact.description}</p>
              <div className="flex justify-center space-x-6">
                {t.welcome.contact.platforms.map((platform) => (
                  <button
                    key={platform}
                    className="border-border bg-card text-card-foreground rounded-lg border px-6 py-3 shadow backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/10"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </m.div>
        </ParallaxSection>
      </div>
    </LazyMotion>
  );
}
