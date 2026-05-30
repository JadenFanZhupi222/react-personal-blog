'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  bgClass?: string;
}

export const ParallaxSection = ({
  children,
  className = '',
  bgClass = '',
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const bg = bgRef.current;
      const content = contentRef.current;
      if (!section || !bg || !content) return;

      gsap.fromTo(
        bg,
        { backgroundPosition: '50% 0px' },
        {
          backgroundPosition: '50% 200px',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        content,
        { y: 0 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className={`relative min-h-screen overflow-hidden ${className}`}>
      <div
        ref={bgRef}
        className="absolute inset-0 h-full w-full"
        style={{
          background: bgClass,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'background-position',
        }}
      />

      <div
        ref={contentRef}
        className="relative z-10 flex min-h-screen items-center justify-center"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
};

export const GradientParallaxSection = ({
  children,
  className = '',
  gradientFrom,
  gradientVia,
  gradientTo,
  ...props
}: ParallaxSectionProps & {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
}) => {
  const bgClass = `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientVia} 50%, ${gradientTo} 100%)`;

  return (
    <ParallaxSection bgClass={bgClass} className={`relative ${className}`} {...props}>
      {children}
    </ParallaxSection>
  );
};
