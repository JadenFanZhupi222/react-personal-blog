'use client';

import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/lib/hooks/useTranslations';

export interface AchievementsLinkProps {
  text: string;
}

export function AchievementsLink({ text }: AchievementsLinkProps) {
  const { locale } = useTranslations();
  return (
    <div className="mt-2 flex justify-center">
      <Link
        href={`/${locale}/achievements`}
        className="flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/15 px-4 py-2 text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_0_26px_color-mix(in_srgb,var(--secondary)_34%,transparent)] active:translate-y-0 active:duration-75"
      >
        <Trophy className="h-4 w-4" />
        <span className="text-sm">{text}</span>
      </Link>
    </div>
  );
}
