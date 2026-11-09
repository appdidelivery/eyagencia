import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@resvg/resvg-js'],
  outputFileTracingIncludes: {
    // Bundle the exact user-supplied Velo mark and font glyphs in functions
    // that render the cover. Static /public URLs alone are not sufficient.
    '/api/cron/social-agent': [
      './node_modules/@expo-google-fonts/noto-sans/**/*.ttf',
      './public/brand/velo-delivery-official.png',
    ],
    '/api/cron/velo-blog-social': [
      './node_modules/@expo-google-fonts/noto-sans/**/*.ttf',
      './public/brand/velo-delivery-official.png',
    ],
    '/api/cron/weekly-stories': [
      './node_modules/@expo-google-fonts/noto-sans/**/*.ttf',
      './public/brand/velo-delivery-official.png',
    ],
    '/api/cron/social-pilot': [
      './node_modules/@expo-google-fonts/noto-sans/**/*.ttf',
      './public/brand/velo-delivery-official.png',
    ],
    '/api/social-agent/preview': [
      './node_modules/@expo-google-fonts/noto-sans/**/*.ttf',
      './public/brand/velo-delivery-official.png',
    ],
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