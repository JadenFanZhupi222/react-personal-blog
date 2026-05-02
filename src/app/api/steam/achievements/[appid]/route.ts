import { NextRequest, NextResponse } from 'next/server';
import { SteamAPI } from '@/api/steam';
import type { SteamAchievementSchema, SteamAchievement } from '@/lib/steam/types';
import { API_ERROR_MESSAGES, HTTP_STATUS } from '@/api/config';
import { checkOrigin } from '@/lib/utils/checkOrigin';
import { checkRateLimit } from '@/lib/utils/rateLimit';

const steamAPI = new SteamAPI();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appid: string }> }
) {
  const originError = checkOrigin(request);
  if (originError) return originError;
  const rateLimitError = await checkRateLimit(request);
  if (rateLimitError) return rateLimitError;

  try {
    const { appid } = await params;
    const appidNum = parseInt(appid, 10);
    if (isNaN(appidNum)) {
      return NextResponse.json(
        { error: API_ERROR_MESSAGES.INVALID_PARAMS },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const url = new URL(request.url);
    const lang = url.searchParams.get('language') || 'english';

    const [playerAchievements, gameSchema, globalRarity] = await Promise.all([
      steamAPI.getPlayerAchievements(appidNum, lang),
      steamAPI.getGameSchema(appidNum, lang),
      steamAPI.getGlobalAchievementRarity(appidNum),
    ]);

    const achievements = gameSchema.map((schema: SteamAchievementSchema) => {
      const playerAchievement = playerAchievements.find(
        (pa: SteamAchievement) => pa.apiname === schema.name
      );
      const rarityRaw = globalRarity[schema.name];
      const rarity = rarityRaw !== undefined ? Number(rarityRaw) : undefined;
      return {
        ...schema,
        achieved: playerAchievement?.achieved || 0,
        unlocktime: playerAchievement?.unlocktime || 0,
        rarity,
      };
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json(
      { error: API_ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
