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
        className="text-secondary-foreground bg-secondary hover:bg-secondary/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/40 active:translate-y-0 active:shadow-md active:duration-75 flex items-center gap-1 rounded-full border-0 px-4 py-2 shadow-md transition-all duration-200"
      >
        <Trophy className="text-secondary-foreground h-4 w-4" />
        <span className="text-sm">{text}</span>
      </Link>
    </div>
  );
}
