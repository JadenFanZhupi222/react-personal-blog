// API Basic Config
export const API_CONFIG = {
  // LeetCode API
  LEETCODE: {
    BASE: 'https://leetcode.com/graphql',
    USER_STATS: (username: string) => `/users/${username}`,
  },

  // Steam API
  STEAM: {
    BASE: 'https://api.steampowered.com',
    ENDPOINTS: {
      // User related
      PLAYER_SUMMARIES: (apiKey: string, steamId: string) =>
        `/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`,

      // Game related
      RECENT_GAMES: (apiKey: string, steamId: string, count: number = 5) =>
        `/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${steamId}&count=${count}`,

      OWNED_GAMES: (apiKey: string, steamId: string) =>
        `/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`,

      // Achievement related
      PLAYER_ACHIEVEMENTS: (
        apiKey: string,
        steamId: string,
        appId: number,
        lang: string = 'english'
      ) =>
        `/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${appId}&l=${lang}`,

      GAME_SCHEMA: (apiKey: string, appId: number, lang: string = 'english') =>
        `/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${appId}&l=${lang}`,

      GLOBAL_ACHIEVEMENTS: (appId: number) =>
        `/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appId}`,
    },
  },
} as const;

// API Timeout Config
export const API_TIMEOUT = {
  DEFAULT: 10000,
  LONG: 30000,
} as const;

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error, please check your connection',
  SERVER_ERROR: 'Server error, please try again later',
  TIMEOUT_ERROR: 'Request timeout, please try again later',
  NOT_FOUND: 'Requested resource not found',
  UNAUTHORIZED: 'Unauthorized, please login first',
  FORBIDDEN: 'Access forbidden',
  INVALID_PARAMS: 'Invalid parameters',
  MISSING_PARAMS: 'Missing required parameters',
  DATA_NOT_FOUND: 'No data found',
  UNKNOWN_ERROR: 'Unknown error occurred',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
