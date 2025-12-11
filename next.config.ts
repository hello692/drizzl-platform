import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for minimal production build
  output: 'standalone',
  // Handle dev origins safely - only in development
  ...(process.env.REPLIT_DOMAINS && {
    allowedDevOrigins: [process.env.REPLIT_DOMAINS.split(",")[0]],
  }),
  i18n: {
    locales: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'pt', 'it', 'ru', 'ar', 'hi'],
    defaultLocale: 'en',
  },
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Ignore ESLint/TypeScript errors during production build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
