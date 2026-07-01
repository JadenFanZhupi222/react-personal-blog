import { Clock } from 'lucide-react';
import type { SteamStats } from '@/lib/steam/types';
import Image from 'next/image';

export interface ProfileSectionProps {
  profile: SteamStats['profile'];
  totalPlaytime: number;
  formatPlaytime: (minutes: number) => string;
  t: {
    totalPlaytime: string;
    online: string;
    offline: string;
  };
}

export function ProfileSection({ profile, totalPlaytime, formatPlaytime, t }: ProfileSectionProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-background/25 p-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-xl ring-1 ring-secondary/40">
        <Image
          src={profile.avatar}
          alt={profile.personaname}
          fill
          sizes="48px"
          className="object-cover"
          priority={true}
        />
      </div>
      <div>
        <h3 className="text-foreground font-semibold leading-tight">{profile.personaname}</h3>
        <p
          className="text-sm"
          style={{
            color: profile.personastate === 1 ? 'var(--steam-online)' : 'var(--steam-offline)',
          }}
        >
          {profile.personastate === 1 ? t.online : t.offline}
        </p>
      </div>
      <div className="ml-auto text-right">
        <div className="text-muted-foreground flex items-center gap-1">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">{t.totalPlaytime}</span>
        </div>
        <p className="text-foreground font-semibold">{formatPlaytime(totalPlaytime)}</p>
      </div>
    </div>
  );
}
