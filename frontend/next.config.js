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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next': require.resolve('next')
    }
    return config;
  },
}

module.exports = nextConfig 