'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  cover: string;
  coverAlt: string;
  label: string;
  title: string;
  description: string;
  actionText: string;
  metadata: string;
  featured?: boolean;
}

export function FeatureCard({
  href,
  cover,
  coverAlt,
  label,
  title,
  description,
  actionText,
  metadata,
  featured = false,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="focus-visible:ring-ring block rounded-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <motion.article
        className="group min-w-0 overflow-hidden rounded-lg bg-[#0a0a0a] text-white"
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          data-slot="feature-media"
          className={`relative overflow-hidden bg-[#151515] ${
            featured ? 'aspect-[16/8]' : 'aspect-[16/7] lg:aspect-[4/3]'
          }`}
        >
          <Image
            src={cover}
            alt={coverAlt}
            fill
            sizes={
              featured ? '(max-width: 1023px) 100vw, 67vw' : '(max-width: 1023px) 100vw, 33vw'
            }
            className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.025]"
          />
          <span className="bg-primary absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-black">
            {label}
          </span>
        </div>

        <div
          data-slot="feature-content"
          className={`flex flex-col ${featured ? 'min-h-64 p-6 sm:p-8' : 'min-h-72 p-6'}`}
        >
          <p className="text-xs font-semibold tracking-[0.08em] text-white/58">{metadata}</p>
          <h3
            className={`mt-4 font-black tracking-[-0.04em] text-balance ${
              featured
                ? 'max-w-3xl text-4xl leading-[1.02] sm:text-5xl'
                : 'text-2xl leading-[1.08] sm:text-3xl'
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-4 max-w-[62ch] leading-7 text-pretty text-white/70 ${
              featured ? 'line-clamp-2' : 'line-clamp-3'
            }`}
          >
            {description}
          </p>
          <p className="group-hover:text-primary mt-auto pt-7 text-sm font-bold transition-colors">
            {actionText} <span aria-hidden="true">→</span>
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
