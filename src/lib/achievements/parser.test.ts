import { describe, it, expect } from 'vitest';
import {
  filterGamesByPlaytime,
  paginateGames,
  sortAchievementsByStatusAndRarity,
  MIN_PLAYTIME_HOURS,
  ITEMS_PER_PAGE,
} from './parser';
import type { ParsedGame } from '@/lib/steam/parser';

const game = (overrides: Partial<ParsedGame>): ParsedGame => ({
  appid: 1,
  name: 'Game',
  playtime: 0,
  icon: '',
  logo: '',
  ...overrides,
});

describe('filterGamesByPlaytime', () => {
  it('keeps games with playtime >= MIN_PLAYTIME_HOURS by default', () => {
    const threshold = MIN_PLAYTIME_HOURS * 60;
    const games = [
      game({ appid: 1, playtime: threshold - 1 }),
      game({ appid: 2, playtime: threshold }),
      game({ appid: 3, playtime: threshold + 100 }),
    ];
    expect(filterGamesByPlaytime(games).map((g) => g.appid)).toEqual([2, 3]);
  });

  it('respects a custom minimum threshold', () => {
    const games = [
      game({ appid: 1, playtime: 30 }),
      game({ appid: 2, playtime: 90 }),
    ];
    expect(filterGamesByPlaytime(games, 1).map((g) => g.appid)).toEqual([2]);
  });
});

describe('paginateGames', () => {
  it('slices items for the requested page using ITEMS_PER_PAGE', () => {
    const games = Array.from({ length: ITEMS_PER_PAGE * 2 + 2 }, (_, i) =>
      game({ appid: i, playtime: i })
    );
    const page2 = paginateGames(games, 2);
    expect(page2).toHaveLength(ITEMS_PER_PAGE);
    expect(page2[0].appid).toBe(ITEMS_PER_PAGE);
  });
});

describe('sortAchievementsByStatusAndRarity', () => {
  it('puts achieved items first then sorts by ascending rarity', () => {
    const result = sortAchievementsByStatusAndRarity([
      { id: 'a', achieved: 0, rarity: 50 },
      { id: 'b', achieved: 1, rarity: 80 },
      { id: 'c', achieved: 1, rarity: 10 },
      { id: 'd', achieved: 0, rarity: 20 },
    ]);
    expect(result.map((r) => r.id)).toEqual(['c', 'b', 'd', 'a']);
  });

  it('treats missing rarity as last within its group', () => {
    const result = sortAchievementsByStatusAndRarity([
      { id: 'a', achieved: 1, rarity: 5 },
      { id: 'b', achieved: 1 },
      { id: 'c', achieved: 1, rarity: 30 },
    ]);
    expect(result.map((r) => r.id)).toEqual(['a', 'c', 'b']);
  });

  it('does not mutate the input array', () => {
    const input = [
      { id: 'a', achieved: 0, rarity: 1 },
      { id: 'b', achieved: 1, rarity: 2 },
    ];
    const before = [...input];
    sortAchievementsByStatusAndRarity(input);
    expect(input).toEqual(before);
  });
});
