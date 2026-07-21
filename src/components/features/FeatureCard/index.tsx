'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  cover: string;
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
      className="focus-visible:ring-ring block h-full rounded-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <motion.div
        className="h-full"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        <article
          className={`group relative min-w-0 overflow-hidden rounded-lg bg-[#0a0a0a] text-white ${
            featured
              ? 'min-h-[30rem] sm:min-h-[34rem]'
              : 'min-h-[25rem] sm:min-h-[28rem] lg:min-h-[34rem]'
          }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={cover}
              alt=""
              fill
              sizes={
                featured ? '(max-width: 1023px) 100vw, 67vw' : '(max-width: 1023px) 100vw, 33vw'
              }
              className={`object-cover transition-transform duration-700 ${
                featured
                  ? 'scale-[1.12] group-hover:scale-[1.16]'
                  : 'scale-[1.1] group-hover:scale-[1.14]'
              }`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.96)_100%)]" />
          </div>
          <div className="relative flex min-h-[inherit] flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold">
              <span className="text-primary">{label}</span>
              <span className="text-right text-white/62">{metadata}</span>
            </div>
            <div className={featured ? 'max-w-3xl' : 'max-w-xl'}>
              <h3
                className={`leading-[0.98] font-black tracking-[-0.04em] text-balance ${
                  featured ? 'text-4xl sm:text-5xl' : 'text-3xl'
                }`}
              >
                {title}
              </h3>
              <p
                className={`mt-4 max-w-[62ch] leading-7 text-pretty text-white/72 ${
                  featured ? 'line-clamp-3' : 'line-clamp-4'
                }`}
              >
                {description}
              </p>
              <p className="group-hover:text-primary mt-7 text-sm font-bold text-white transition-colors">
                {actionText} <span aria-hidden="true">→</span>
              </p>
            </div>
          </div>
        </article>
      </motion.div>
    </Link>
  );
}
