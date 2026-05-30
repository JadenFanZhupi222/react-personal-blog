'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslations } from '@/lib/hooks/useTranslations';
import { AchievementCard, type Achievement } from '@/components/achievements/AchievementCard';
import { AchievementsCardSkeleton } from '@/components/skeleton/AchievementsCardSkeleton';
import { ErrorFunc } from '@/components/features/Error';
import { splitChars } from '@/components/welcome/lib/splitChars';
import { useReducedMotion } from '@/components/welcome/lib/useReducedMotion';
import {
  steamQueryKey,
  fetchSteamStats,
  steamAchievementsQueryKey,
  fetchSteamAchievements,
} from '@/lib/queries/steam';
import { formatPlaytime } from '@/lib/utils/format';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AchievementDetailPage({ appid }: { appid: number }) {
  const { t, locale } = useTranslations();
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { data: steamData, error: steamError } = useQuery({
    queryKey: steamQueryKey,
    queryFn: fetchSteamStats,
  });

  const game = steamData?.ownedGames.find((g) => g.appid === appid);

  const {
    data: achievements = [],
    isFetching: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useQuery({
    queryKey: steamAchievementsQueryKey(appid, locale),
    queryFn: () => fetchSteamAchievements(appid, locale),
  });

  // Hero: parallax on the image wrapper + split-char reveal on the title.
  // Game-name dep ensures the title animation fires once data lands.
  useGSAP(
    () => {
      if (reduced) return;
      const hero = heroRef.current;
      const parallax = parallaxRef.current;
      if (!hero || !parallax) return;

      gsap.to(parallax, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const chars = hero.querySelectorAll('[data-anim="hero-title"] [data-char]');
      if (chars.length > 0) {
        gsap.from(chars, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.025,
          duration: 0.7,
          ease: 'expo.out',
          delay: 0.1,
        });
      }
    },
    { scope: heroRef, dependencies: [reduced, steamData?.ownedGames?.length] },
  );

  if (steamError) return <ErrorFunc />;

  const achievedAchs = achievements
    .filter((a) => a.achieved)
    .sort((a, b) => (b.unlocktime ?? 0) - (a.unlocktime ?? 0));
  const lockedAchs = achievements
    .filter((a) => !a.achieved)
    .sort((a, b) => {
      const rA = typeof a.rarity === 'number' ? a.rarity : 9999;
      const rB = typeof b.rarity === 'number' ? b.rarity : 9999;
      return rA - rB;
    });
  const achievedCount = achievedAchs.length;
  const total = achievements.length;
  const completionPct = total > 0 ? Math.round((achievedCount / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Full-bleed hero — breaks out of the standard max-w-7xl page container.
          Library_hero artwork fills the viewport width; a downward gradient
          fades into the page background so the transition is seamless. */}
      <div
        ref={heroRef}
        className="relative aspect-[1920/620] min-h-[240px] w-full overflow-hidden"
      >
        {/* Image wrapped in a parallax-target div so GSAP can transform
            the wrapper without fighting the Ken Burns CSS animation on
            the image itself. */}
        <div ref={parallaxRef} className="absolute inset-0">
          {game && (
            <Image
              src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`}
              alt={game.name}
              fill
              sizes="100vw"
              className="animate-ken-burns object-cover"
              priority
            />
          )}
        </div>
        {/* Vertical scrim — bottom 30% is solid background so the title sits
            on a clean backing AND the boundary to the page below is seamless
            (no mid-opacity color band where image leaks through). */}
        <div className="absolute inset-0 bg-gradient-to-t from-background from-30% to-transparent" />
        {/* Side scrim — left side darkened for title legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Back link, top-left, floating chip. Uses fixed dark-glass styling
            (not theme-aware) because it sits over the hero image in both
            themes — matches the page-title's text-white and GameGridCard's
            featured badge. */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <Link
            href={`/${locale}/achievements`}
            className="bg-black/50 text-white hover:bg-black/70 hover:-translate-x-0.5 active:translate-x-0 active:duration-75 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-lg backdrop-blur-md transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.achievements.title}
          </Link>
        </div>

        {/* Title + inline stats, bottom-left, in the max-w-7xl gutter */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
            {game && (
              <>
                <h1
                  data-anim="hero-title"
                  className="overflow-hidden text-3xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
                >
                  {splitChars(game.name)}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-white/85 drop-shadow-md sm:text-lg">
                  <span className="tabular-nums">{formatPlaytime(game.playtime)}</span>
                  {total > 0 && (
                    <>
                      <span className="text-white/50">·</span>
                      <span className="tabular-nums">
                        {achievedCount}/{total} {t.achievements.stats.achievements.title}
                      </span>
                      <span className="text-white/50">·</span>
                      <span className="tabular-nums">{completionPct}%</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Achievement sections, in the centered content gutter */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {achievementsLoading ? (
          <AchievementsCardSkeleton />
        ) : achievementsError ? (
          <ErrorFunc onRetry={() => refetchAchievements()} />
        ) : achievements.length === 0 ? (
          <p className="text-muted-foreground">{t.achievements.noAchievements}</p>
        ) : (
          <>
            {achievedAchs.length > 0 && (
              <AchievementSection
                title={t.achievements.achieved}
                count={achievedAchs.length}
                items={achievedAchs}
                idPrefix="a"
              />
            )}
            {lockedAchs.length > 0 && (
              <AchievementSection
                title={t.achievements.locked}
                count={lockedAchs.length}
                items={lockedAchs}
                idPrefix="l"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AchievementSection({
  title,
  count,
  items,
  idPrefix,
}: {
  title: string;
  count: number;
  items: Achievement[];
  idPrefix: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      if (!section) return;

      const cards = section.querySelectorAll<HTMLElement>('[data-ach-card]');

      // gsap.from (not set+to) so cards default visible. Safer when onEnter
      // doesn't fire for cards already in viewport at creation.
      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        onEnter: (els) =>
          gsap.from(els, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            overwrite: true,
          }),
      });
    },
    { scope: sectionRef, dependencies: [reduced, items.length] },
  );

  return (
    <section ref={sectionRef}>
      <div className="mb-4 flex items-baseline gap-3">
        <h2 className="text-foreground text-xl font-bold">{title}</h2>
        <span className="text-muted-foreground text-sm tabular-nums">{count}</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((ach, idx) => (
          <div key={ach.name ?? `${idPrefix}-${idx}`} data-ach-card>
            <AchievementCard achievement={ach} />
          </div>
        ))}
      </div>
    </section>
  );
}
