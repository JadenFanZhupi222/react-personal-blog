'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { motion, useAnimation } from 'framer-motion';

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  compact?: boolean;
}

export function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  actionText,
  compact = false,
}: FeatureCardProps) {
  const controls = useAnimation();

  return (
    <Link
      href={href}
      className="focus-visible:ring-ring block h-full rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <motion.div
        className="h-full"
        onMouseEnter={() => controls.start({ scale: 1.12 })}
        onMouseLeave={() => controls.start({ scale: 1 })}
      >
        <Card className="group bg-card text-card-foreground hover:border-primary/70 h-full min-w-0 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_color-mix(in_srgb,var(--background)_70%,black_30%)]">
          <CardContent className={compact ? 'p-4' : 'p-5 sm:p-6'}>
            <div
              className={
                compact
                  ? 'flex items-center gap-3 text-left'
                  : 'flex min-h-48 flex-col items-start justify-between gap-6 text-left'
              }
            >
              <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-transform duration-300 group-hover:-rotate-3">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-2">
                <h3 className="text-foreground text-lg font-semibold tracking-[-0.01em]">
                  {title}
                </h3>
                {!compact && <p className="text-muted-foreground leading-7">{description}</p>}
                <motion.p
                  className="text-primary inline-flex text-sm font-medium"
                  animate={controls}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {actionText}
                </motion.p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
