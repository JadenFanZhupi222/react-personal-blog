import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GlareCard } from '@/components/effects/GlareCard';
import React from 'react';

interface ContactCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  cardClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function ContactCard({
  icon,
  title,
  children,
  cardClassName = '',
  headerClassName = '',
  contentClassName = '',
}: ContactCardProps) {
  return (
    <GlareCard subtle className="rounded-xl">
      <Card
        className={`observatory-panel flex h-full flex-col rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1 ${cardClassName}`}
      >
        <CardHeader className={`pt-2 pb-0 ${headerClassName}`}>
          <CardTitle className="mx-auto flex items-center gap-2 text-xl font-semibold tracking-[-0.02em]">
            <span className="text-primary">{icon}</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent
          className={`flex flex-1 flex-col items-center justify-center ${contentClassName}`}
        >
          {children}
        </CardContent>
      </Card>
    </GlareCard>
  );
}
