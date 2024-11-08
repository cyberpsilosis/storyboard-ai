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
  }
}

module.exports = nextConfig 