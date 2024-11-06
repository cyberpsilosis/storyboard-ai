/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  experimental: {
    forceSwcTransforms: true,
    esmExternals: 'loose'
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer }) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom')
      },
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false
      }
    }

    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(tsx|ts|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['next/babel']
            }
          }
        }
      ]
    }

    return config
  },
  transpilePackages: ['react', 'react-dom']
}

module.exports = nextConfig 