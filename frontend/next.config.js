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
  // Configure page extensions and directories
  pageExtensions: ['tsx', 'ts'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next': require.resolve('next')
    }
    return config;
  },
  // Ensure both app and pages directories are used
  useFileSystemPublicRoutes: true,
}

module.exports = nextConfig 