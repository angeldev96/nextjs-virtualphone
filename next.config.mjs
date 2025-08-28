/**
 * next.config.js
 * Webflow Cloud requires Next.js apps to set the basePath and assetPrefix
 * to the environment mount path. Webflow Cloud provides BASE_URL and
 * ASSETS_PREFIX env vars during build/deploy; fall back to empty string.
 */

const basePath = process.env.BASE_URL || '';
const assetPrefix = process.env.ASSETS_PREFIX || process.env.BASE_URL || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  assetPrefix,
  output: 'standalone',
};

export default nextConfig;
