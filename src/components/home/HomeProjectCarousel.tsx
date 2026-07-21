'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { HomeProject } from './types';
import { ProjectArtwork } from './ProjectArtwork';

interface HomeProjectCarouselProps {
  projects: HomeProject[];
  locale: 'en' | 'zh';
  labels: {
    title: string;
    previous: string;
    next: string;
    viewProject: string;
  };
}

export function HomeProjectCarousel({ projects, locale, labels }: HomeProjectCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="project-showcase-title" className="overflow-hidden bg-[#090909] text-white">
      <header className="flex items-end justify-between gap-5 border-b border-white/14 px-5 py-6 sm:px-8 lg:px-10">
        <div>
          <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#ffc500] uppercase">Selected work</span>
          <h2 id="project-showcase-title" className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            {labels.title}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span aria-live="polite" className="mr-2 font-mono text-xs font-bold tracking-[0.12em] text-white/55">
            {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => swiper?.slidePrev()} aria-label={labels.previous} className="grid h-11 w-11 place-items-center border border-white/20 text-xl transition-colors hover:border-[#ffc500] hover:bg-[#ffc500] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc500]">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => swiper?.slideNext()} aria-label={labels.next} className="grid h-11 w-11 place-items-center bg-[#ffc500] text-xl text-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc500]">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      <Swiper
        modules={[Keyboard, A11y]}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        rewind={projects.length > 1}
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
      >
        {projects.map((project, index) => {
          const href = project.url || `/${locale}/projects`;
          return (
            <SwiperSlide key={project.slug || project.title}>
              <article className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,.65fr)]">
                <ProjectArtwork slug={project.slug} title={project.title} />
                <div className="flex min-h-[24rem] flex-col justify-between border-t border-white/14 p-6 sm:p-8 lg:min-h-0 lg:border-t-0 lg:border-l lg:p-10">
                  <div>
                    <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-white/42">PROJECT {String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-5 text-3xl leading-[.98] font-black tracking-[-0.045em] text-balance sm:text-4xl lg:text-5xl">{project.title}</h3>
                    <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base">{project.description}</p>
                    <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/12 pt-5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] font-bold tracking-[0.1em] text-white/48 uppercase">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={href} target={project.url ? '_blank' : undefined} rel={project.url ? 'noreferrer' : undefined} className="mt-8 inline-flex min-h-11 w-fit items-center gap-3 border-b-2 border-[#ffc500] text-sm font-black transition-colors hover:text-[#ffc500] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffc500]">
                    {labels.viewProject} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
