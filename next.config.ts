import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

// Fail fast if required env vars are missing
const requiredEnvVars = ['MONGODB_URI', 'STEAM_API_KEY', 'STEAM_ID'];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const nextConfig: NextConfig = {
  // Enable Cache Components ("use cache" directive) - Next.js 16 feature
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
        pathname: '/steam/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        pathname: '/steamcommunity/public/images/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'media.steampowered.com',
        pathname: '/steamcommunity/public/images/apps/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
        pathname: '/**',
      },
    ],
  },
};

export default withPayload(nextConfig);
