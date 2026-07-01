'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { GlareCard } from '@/components/effects/GlareCard';
import { MagneticCard } from '@/components/effects/MagneticCard';
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
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MagneticCard>
        <GlareCard subtle>
          <motion.div
            className="h-full"
            onMouseEnter={() => controls.start({ scale: 1.12 })}
            onMouseLeave={() => controls.start({ scale: 1 })}
          >
            <Card className="observatory-panel group h-full min-w-0 rounded-xl bg-card/80 text-card-foreground transition-colors duration-300 hover:border-primary/50">
              <CardContent className={compact ? 'p-4' : 'p-5 sm:p-6'}>
                <div
                  className={
                    compact
                      ? 'flex items-center gap-3 text-left'
                      : 'flex min-h-48 flex-col items-start justify-between gap-6 text-left'
                  }
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <h3 className="text-foreground text-lg font-semibold tracking-[-0.01em]">
                      {title}
                    </h3>
                    {!compact && <p className="text-muted-foreground leading-7">{description}</p>}
                    <motion.p
                      className="inline-flex text-sm font-medium text-primary"
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
        </GlareCard>
      </MagneticCard>
    </Link>
  );
}
