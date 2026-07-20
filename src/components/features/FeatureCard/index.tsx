'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  index?: string;
  cover: string;
}

export function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  actionText,
  index = '00',
  cover,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="focus-visible:ring-ring block h-full rounded-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <motion.div
        className="h-full"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        <article className="group bg-card text-card-foreground h-full min-w-0 overflow-hidden rounded-lg shadow-[0_14px_38px_color-mix(in_srgb,var(--background)_78%,black_22%)]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#111] text-white sm:aspect-[16/9]">
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_42%,rgba(0,0,0,0.88)_100%)]" />
            <span className="text-primary absolute top-5 left-5 font-mono text-xs font-bold tracking-[0.18em]">
              {index}
            </span>
            <div className="group-hover:border-primary/70 group-hover:text-primary absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/18 bg-black/45 text-white backdrop-blur-sm transition-colors duration-300">
              <Icon className="h-5 w-5" />
            </div>
            <span className="absolute right-5 bottom-5 left-5 text-3xl leading-none font-black tracking-[-0.04em] text-balance text-white sm:text-4xl">
              {title}
            </span>
          </div>
          <div className="flex min-h-40 flex-col justify-between gap-7 p-5 sm:p-6">
            <p className="text-muted-foreground leading-7 text-pretty">{description}</p>
            <p className="text-foreground inline-flex items-center gap-2 text-sm font-bold">
              <span className="bg-primary h-2 w-2" />
              {actionText}
            </p>
          </div>
        </article>
      </motion.div>
    </Link>
  );
}
