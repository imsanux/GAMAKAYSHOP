import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ── Image optimization ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [375, 640, 828, 1080, 1200, 1920],
    imageSizes: [48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },

  // ── Output ─────────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Bundle optimization ────────────────────────────────────────────────────
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'embla-carousel-react',
      'embla-carousel-auto-scroll',
      '@supabase/supabase-js',
      '@vercel/analytics',
      '@vercel/speed-insights',
    ],
  },

  // ── HTTP headers ────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Security + performance headers on every route
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Immutable cache for product/banner WebP images — 30 days
        source: '/IMAGES/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, immutable' },
        ],
      },
      {
        // Long cache for other static assets — 7 days + stale-while-revalidate
        source: '/:path*.(png|jpg|jpeg|gif|svg|webp|ico|woff2|woff)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
