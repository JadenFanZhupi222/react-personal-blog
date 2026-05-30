'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Panel gradients — deterministic per index, brand-aligned
const GRADIENTS = [
  'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #ec4899 100%)',
  'linear-gradient(135deg, #042f2e 0%, #0d9488 60%, #fde047 100%)',
  'linear-gradient(135deg, #450a0a 0%, #b91c1c 60%, #fb923c 100%)',
  'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 60%, #fdbb2d 100%)',
];

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
        {projects.map((project, i) => (
          <div
            key={project.title}
            className="relative flex h-full shrink-0 items-center justify-center px-8"
            style={{
              width: `${100 / projects.length}%`,
              background: GRADIENTS[i % GRADIENTS.length],
            }}
          >
            <div className="max-w-4xl text-center">
              <h3
                className="text-7xl leading-[1.05] font-black tracking-tight text-white sm:text-8xl md:text-9xl"
                style={{ mixBlendMode: 'difference' }}
              >
                {project.title}
              </h3>
              <p className="mt-6 text-xl text-white/90 sm:text-2xl">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
