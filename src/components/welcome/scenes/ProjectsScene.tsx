'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One accent hue per panel — used only as a thin underline + corner tag.
// Keeps the scene unified (shader carries the bg) but gives each project a tiny signature.
const ACCENTS = ['#818cf8', '#f472b6', '#34d399', '#fbbf24'];

export function ProjectsScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslations();
  const projects = t.welcome.projects.items;

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || projects.length < 2) return;

      const panels = track.children.length;
      gsap.to(track, {
        xPercent: -100 * (panels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => '+=' + track.scrollWidth,
          scrub: 1,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced, projects.length] },
  );

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${projects.length * 100}%` }}
      >
        {projects.map((project, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const num = String(i + 1).padStart(2, '0');
          return (
            <div
              key={project.title}
              className="relative flex h-full shrink-0 flex-col items-start justify-center px-12 sm:px-24"
              style={{ width: `${100 / projects.length}%` }}
            >
              {/* index tag in the corner */}
              <span
                className="absolute top-12 left-12 font-mono text-sm tracking-widest text-foreground/40 sm:left-24"
                style={{ color: accent, opacity: 0.7 }}
              >
                {num} / {String(projects.length).padStart(2, '0')}
              </span>

              <div className="max-w-4xl">
                <h3 className="text-6xl leading-[0.95] font-black tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
                  {project.title}
                </h3>
                {/* signature accent line under the title */}
                <div
                  className="mt-8 h-px w-24"
                  style={{ background: accent, boxShadow: `0 0 18px ${accent}80` }}
                />
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {project.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
