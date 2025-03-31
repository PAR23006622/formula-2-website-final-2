/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    domains: ['flagcdn.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fiaformula2.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/prod-f2f3/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['chrome-aws-lambda', 'puppeteer-core']
  },
  env: {
    // Set this to indicate we're in build phase
    NEXT_PHASE: process.env.NEXT_PHASE || ''
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'puppeteer-core': 'puppeteer-core',
        'chrome-aws-lambda': 'chrome-aws-lambda'
      });
    }
    // Ignore source maps for chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
    }
    return config;
  }
};

// Set the NEXT_PHASE environment variable during build
if (process.env.npm_lifecycle_event === 'build') {
  process.env.NEXT_PHASE = 'phase-production-build';
  console.log('Setting NEXT_PHASE to phase-production-build');
}

module.exports = nextConfig;