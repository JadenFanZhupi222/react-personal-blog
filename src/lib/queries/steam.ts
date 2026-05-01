import type { SteamStats, AchievementDetail } from '@/lib/steam/types';
import type { ParsedGame } from '@/lib/steam/parser';
import { parseGamesArray, sortGamesByPlaytime } from '@/lib/steam/parser';
import { sortAchievementsByStatusAndRarity } from '@/lib/achievements/parser';
import type { Locale } from '@/i18n/types';

export const steamQueryKey = ['steam'] as const;

export const steamLangMap: Record<Locale, string> = {
  en: 'english',
  zh: 'schinese',
};

export interface ParsedSteamStats {
  profile: SteamStats['profile'];
  recentGames: ParsedGame[];
  ownedGames: ParsedGame[];
  totalPlaytime: number;
}

export function parseSteamStats(stats: SteamStats): ParsedSteamStats {
  return {
    profile: stats.profile,
    recentGames: sortGamesByPlaytime(parseGamesArray(stats.recentGames)),
    ownedGames: sortGamesByPlaytime(parseGamesArray(stats.ownedGames)),
    totalPlaytime: stats.totalPlaytime,
  };
}

export async function fetchSteamStats(): Promise<ParsedSteamStats> {
  const res = await fetch('/api/steam');
  if (!res.ok) throw new Error(`Steam request failed: ${res.status}`);
  const stats = (await res.json()) as SteamStats;
  return parseSteamStats(stats);
}

export const steamAchievementsQueryKey = (appid: number, locale: Locale) =>
  ['steam', 'achievements', appid, locale] as const;

export async function fetchSteamAchievements(
  appid: number,
  locale: Locale
): Promise<AchievementDetail[]> {
  const lang = steamLangMap[locale] || 'english';
  const res = await fetch(`/api/steam/achievements/${appid}?language=${lang}`);
  if (!res.ok) throw new Error(`Achievements request failed: ${res.status}`);
  const data = (await res.json()) as AchievementDetail[];
  return sortAchievementsByStatusAndRarity(data);
}
