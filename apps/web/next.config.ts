import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// `STATIC_EXPORT=1 pnpm build` emits a plain static site in `out/` for Firebase Hosting.
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mazaq/api', '@mazaq/cart', '@mazaq/i18n', '@mazaq/menu', '@mazaq/tokens'],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    unoptimized: staticExport,
  },
  poweredByHeader: false,
  ...(staticExport && { output: 'export' as const }),
};

export default withNextIntl(nextConfig);
