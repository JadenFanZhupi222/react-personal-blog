'use client';

import { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Token = { text: string; color?: string };

function buildTokens(items: string[]): Token[] {
  const k = (s: string): Token => ({ text: s, color: 'var(--hljs-keyword)' });
  const t = (s: string): Token => ({ text: s, color: 'var(--hljs-entity)' });
  const str = (s: string): Token => ({ text: s, color: 'var(--hljs-string)' });
  const com = (s: string): Token => ({ text: s, color: 'var(--hljs-comment)' });
  const p = (s: string): Token => ({ text: s });

  const tokens: Token[] = [
    k('const'),
    p(' '),
    t('stack'),
    p(': '),
    t('TechStack'),
    p(' = ['),
    p('\n  '),
  ];
  items.forEach((item, i) => {
    tokens.push(str(`'${item}'`));
    if (i < items.length - 1) tokens.push(p(', '));
    if ((i + 1) % 3 === 0 && i < items.length - 1) tokens.push(p('\n  '));
  });
  tokens.push(p(',\n];\n'), com('// I ship things with them.'));
  return tokens;
}

export function TechScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();
  const { t } = useTranslations();

  const tokens = useMemo(() => buildTokens(t.welcome.techStack.items), [t]);
  const fullText = useMemo(() => tokens.map((tk) => tk.text).join(''), [tokens]);

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      const code = codeRef.current;
      if (!section || !code) return;

      const total = fullText.length;
      const state = { count: 0 };

      gsap.to(state, {
        count: total,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: true,
        },
        onUpdate: () => {
          const visible = Math.floor(state.count);
          let remaining = visible;
          const spans = code.querySelectorAll<HTMLSpanElement>('[data-token]');
          spans.forEach((span) => {
            const len = Number(span.dataset.len);
            if (remaining >= len) {
              span.style.opacity = '1';
              span.textContent = span.dataset.full ?? '';
              remaining -= len;
            } else if (remaining > 0) {
              span.style.opacity = '1';
              span.textContent = (span.dataset.full ?? '').slice(0, remaining);
              remaining = 0;
            } else {
              span.style.opacity = '0';
              span.textContent = '';
            }
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced, fullText] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* grid overlay — subtle, just enough to imply structure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
      <pre
        ref={codeRef}
        className="relative max-w-2xl px-6 font-mono text-base leading-relaxed text-foreground sm:text-lg"
      >
        {tokens.map((tk, i) => (
          <span
            key={i}
            data-token
            data-len={tk.text.length}
            data-full={tk.text}
            style={{ color: tk.color, opacity: reduced ? 1 : 0 }}
          >
            {reduced ? tk.text : ''}
          </span>
        ))}
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.1em] bg-foreground"
          style={{ animation: 'blink 1s steps(2, end) infinite' }}
        />
      </pre>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}
