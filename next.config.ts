import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  allowedDevOrigins: [env.REPLIT_DOMAINS.split(",")[0]],
  i18n: {
    locales: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'pt', 'it', 'ru', 'ar', 'hi'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
