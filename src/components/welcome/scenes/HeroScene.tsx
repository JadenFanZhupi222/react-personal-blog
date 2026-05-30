'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { splitChars } from '../lib/splitChars';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t, locale } = useTranslations();

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      const nameChars = inner.querySelectorAll('[data-anim="name"] [data-char]');
      const roleEls = inner.querySelectorAll('[data-anim="role"]');
      const ctaEl = inner.querySelector('[data-anim="cta"]');

      const tl = gsap.timeline();
      tl.from(nameChars, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.035,
        duration: 0.8,
        ease: 'expo.out',
      })
        .from(
          roleEls,
          { y: 20, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' },
          '-=0.3',
        )
        .from(ctaEl, { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

      gsap.to(inner, {
        opacity: 0,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center px-6"
    >
      <div ref={innerRef} className="max-w-5xl space-y-8 text-center">
        <div className="space-y-2">
          <h1
            data-anim="name"
            className="text-white overflow-hidden text-6xl leading-[1.05] font-black tracking-tight sm:text-7xl md:text-8xl"
          >
            {splitChars(t.welcome.name)}
          </h1>
          <h2
            data-anim="name"
            className="text-white overflow-hidden text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl md:text-7xl"
          >
            {splitChars(t.welcome.nickname)}
          </h2>
        </div>
        <p className="flex flex-col items-center justify-center gap-3 text-lg text-zinc-400 sm:flex-row sm:text-xl">
          <span data-anim="role">{t.welcome.role.fullstack}</span>
          <span data-anim="role" className="hidden opacity-40 sm:inline">
            ·
          </span>
          <span data-anim="role">{t.welcome.role.tech}</span>
          <span data-anim="role" className="hidden opacity-40 sm:inline">
            ·
          </span>
          <span data-anim="role">{t.welcome.role.game}</span>
        </p>
        <div data-anim="cta" className="pt-4">
          <Link
            href={`/${locale}/home`}
            className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary hover:shadow-primary/40 inline-flex h-12 items-center justify-center rounded-lg px-8 text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-100"
          >
            {t.welcome.enter}
          </Link>
        </div>
      </div>
    </section>
  );
}
