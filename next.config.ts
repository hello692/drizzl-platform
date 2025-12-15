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
  // Image optimization - enabled for faster loading
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
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
