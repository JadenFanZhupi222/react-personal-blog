'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { splitChars } from '../lib/splitChars';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ContactScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslations();

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll('[data-anim="contact-title"] [data-char]');
      const buttons = section.querySelectorAll('[data-anim="platform"]');
      const desc = section.querySelector('[data-anim="desc"]');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      tl.from(chars, { yPercent: 100, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'expo.out' })
        .from(desc, { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from(
          buttons,
          { y: 20, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
          '-=0.2',
        );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
    >
      <h2
        data-anim="contact-title"
        className="overflow-hidden text-6xl leading-[1.05] font-black tracking-tight text-white sm:text-7xl md:text-8xl"
      >
        {splitChars(t.welcome.contact.title)}
      </h2>
      <p data-anim="desc" className="mt-8 max-w-2xl text-xl text-zinc-400">
        {t.welcome.contact.description}
      </p>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {t.welcome.contact.platforms.map((platform) => (
          <button
            key={platform}
            data-anim="platform"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium tracking-wide text-white shadow-sm backdrop-blur transition-all hover:scale-[1.03] hover:border-white/20 hover:bg-white/[0.08]"
          >
            {platform}
          </button>
        ))}
      </div>
    </section>
  );
}
