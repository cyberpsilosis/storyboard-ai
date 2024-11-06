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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next': require.resolve('next')
    }
    return config;
  },
}

module.exports = nextConfig 