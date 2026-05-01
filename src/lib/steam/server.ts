import 'server-only';
import { SteamAPI } from '@/api/steam';
import { parseSteamStats, type ParsedSteamStats } from '@/lib/queries/steam';

export async function getSteamStats(): Promise<ParsedSteamStats> {
  const steamAPI = new SteamAPI();
  const stats = await steamAPI.getUserStats();
  return parseSteamStats(stats);
}
