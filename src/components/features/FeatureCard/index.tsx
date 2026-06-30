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
}

export function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  actionText,
}: FeatureCardProps) {
  const controls = useAnimation();

  return (
    <Link href={href}>
      <MagneticCard>
        <GlareCard subtle>
          <motion.div
            className="h-full"
            onMouseEnter={() => controls.start({ scale: 1.12 })}
            onMouseLeave={() => controls.start({ scale: 1 })}
          >
            <Card className="bg-card/95 text-card-foreground border-border group hover:border-primary/50 h-full min-w-0 border transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Icon className="text-primary h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                  <div className="space-y-2">
                    <h3 className="text-foreground text-xl font-semibold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                    <motion.p
                      className="text-foreground/80 text-sm font-medium"
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
