/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  experimental: {
    forceSwcTransforms: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Force App Router
  useFileSystemPublicRoutes: true,
  pageExtensions: ['tsx', 'ts'],
  // Disable Pages Router
  trailingSlash: false,
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next': require.resolve('next')
    }
    return config;
  },
}

module.exports = nextConfig 