'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import type { ContactData } from '@/lib/contact/types';
import { splitChars } from '../lib/splitChars';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ContactScene({ contact }: { contact: ContactData | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const checkRef = useRef<HTMLSpanElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const { t } = useTranslations();
  const email = contact?.emails[0]?.value;
  const githubLabel = t.welcome.contact.platforms[0] ?? 'GitHub';
  const emailLabel = t.welcome.contact.platforms[1] ?? 'Email';

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!copied || !checkRef.current) return;
    gsap.fromTo(
      checkRef.current,
      { scale: 0, rotate: -25, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' },
    );
  }, [copied]);

  const copyEmail = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll('[data-anim="contact-title"] [data-char]');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      tl.from(chars, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.04,
        duration: 0.7,
        ease: 'expo.out',
      });
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
        className="overflow-hidden text-6xl leading-[1.05] font-black tracking-tight text-foreground sm:text-7xl md:text-8xl"
      >
        {splitChars(t.welcome.contact.title)}
      </h2>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {contact?.github.link ? (
          <a
            href={contact.github.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-border/70 bg-card-30 px-6 py-3 text-sm font-medium tracking-wide text-foreground shadow-sm backdrop-blur transition-all hover:scale-[1.03] hover:border-primary/40 hover:bg-accent/50"
          >
            {githubLabel}
          </a>
        ) : null}
        {email ? (
          <button
            type="button"
            onClick={copyEmail}
            aria-live="polite"
            className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg border border-border/70 bg-card-30 px-6 py-3 text-sm font-medium tracking-wide text-foreground shadow-sm backdrop-blur transition-all hover:scale-[1.03] hover:border-primary/40 hover:bg-accent/50"
          >
            {copied ? (
              <>
                <span ref={checkRef} aria-hidden>
                  ✓
                </span>
                {t.welcome.contact.copied}
              </>
            ) : (
              emailLabel
            )}
          </button>
        ) : null}
      </div>
    </section>
  );
}
