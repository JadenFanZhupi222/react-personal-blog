'use client';

import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { AchievementsPageMobile } from './AchievementsPageMobile';
import { AchievementsPagePC } from './AchievementsPagePC';

export default function AchievementsPage() {
  const isMobile = useIsMobile(1024);
  return isMobile ? <AchievementsPageMobile /> : <AchievementsPagePC />;
}
