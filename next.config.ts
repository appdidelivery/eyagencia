import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@resvg/resvg-js'],
  outputFileTracingIncludes: {
    '/api/cron/social-agent': ['./node_modules/@expo-google-fonts/noto-sans/**/*.ttf'],
    '/api/social-agent/preview': ['./node_modules/@expo-google-fonts/noto-sans/**/*.ttf'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'cdn.sanity.io'},
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;