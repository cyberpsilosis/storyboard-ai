/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  experimental: {
    forceSwcTransforms: false
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  swcMinify: false
}

module.exports = nextConfig 