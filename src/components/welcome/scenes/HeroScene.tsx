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
          '-=0.3'
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
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6"
    >
      <div
        aria-hidden="true"
        data-effect="welcome-orbit"
        className="welcome-orbit pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        data-effect="welcome-scanline"
        className="welcome-scanline pointer-events-none absolute inset-x-0 top-1/2"
      />
      <div ref={innerRef} className="max-w-5xl space-y-8 text-center">
        <div className="space-y-2">
          <h1
            data-anim="name"
            className="welcome-title text-foreground overflow-hidden text-6xl leading-[1.05] font-black tracking-tight sm:text-7xl md:text-8xl"
          >
            {splitChars(t.welcome.name)}
          </h1>
          <h2
            data-anim="name"
            className="welcome-title welcome-title--sub text-foreground overflow-hidden text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl md:text-7xl"
          >
            {splitChars(t.welcome.nickname)}
          </h2>
        </div>
        <p className="text-muted-foreground flex flex-col items-center justify-center gap-3 font-mono text-sm font-medium tracking-wide sm:flex-row sm:text-base">
          <span data-anim="role" className="welcome-role">
            {t.welcome.role.fullstack}
          </span>
          <span data-anim="role" className="hidden opacity-40 sm:inline">
            ·
          </span>
          <span data-anim="role" className="welcome-role">
            {t.welcome.role.tech}
          </span>
          <span data-anim="role" className="hidden opacity-40 sm:inline">
            ·
          </span>
          <span data-anim="role" className="welcome-role">
            {t.welcome.role.game}
          </span>
        </p>
        <div data-anim="cta" className="flex justify-center pt-4">
          <Link
            href={`/${locale}/home`}
            className="welcome-entry-cta bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-8 text-base font-bold shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0"
          >
            <span aria-hidden className="welcome-entry-cta__pulse" />
            <span className="relative z-10">{t.welcome.enter}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
