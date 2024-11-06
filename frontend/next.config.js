/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    forceSwcTransforms: true
  },
  // Ensure we're not using any Vite-specific features
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig 