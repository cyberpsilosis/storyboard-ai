/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  experimental: {
    forceSwcTransforms: true
  },
  // Explicitly disable any Vite-related processing
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ensure we're using Next.js specific features
      'next': require.resolve('next')
    }
    return config;
  },
}

module.exports = nextConfig 