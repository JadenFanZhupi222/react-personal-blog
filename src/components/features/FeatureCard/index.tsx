'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  index?: string;
}

export function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  actionText,
  index = '00',
}: FeatureCardProps) {
  const controls = useAnimation();

  return (
    <Link
      href={href}
      className="focus-visible:ring-ring block h-full rounded-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <motion.div
        className="h-full"
        onMouseEnter={() => controls.start({ scale: 1.12 })}
        onMouseLeave={() => controls.start({ scale: 1 })}
      >
        <article className="group bg-card text-card-foreground h-full min-w-0 overflow-hidden rounded-lg shadow-[0_14px_38px_color-mix(in_srgb,var(--background)_78%,black_22%)] transition-transform duration-300 hover:-translate-y-1">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#111] p-5 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%),radial-gradient(circle_at_82%_18%,color-mix(in_srgb,var(--primary)_48%,transparent),transparent_34%)]" />
            <span className="absolute top-4 left-4 font-mono text-xs tracking-[0.18em] text-white/55">
              {index}
            </span>
            <div className="bg-primary text-primary-foreground absolute right-5 bottom-5 flex h-16 w-16 items-center justify-center rounded-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 sm:h-20 sm:w-20">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <span className="absolute bottom-4 left-4 max-w-[65%] text-2xl leading-none font-black tracking-[-0.04em] text-white sm:text-3xl">
              {title}
            </span>
          </div>
          <div className="flex min-h-48 flex-col justify-between gap-8 p-5 sm:p-6">
            <div>
              <h3 className="text-foreground text-xl font-bold tracking-[-0.025em]">{title}</h3>
              <p className="text-muted-foreground mt-3 leading-7">{description}</p>
            </div>
            <motion.p
              className="text-foreground inline-flex items-center gap-2 text-sm font-bold"
              animate={controls}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <span className="bg-primary h-2 w-2" />
              {actionText}
            </motion.p>
          </div>
        </article>
      </motion.div>
    </Link>
  );
}
