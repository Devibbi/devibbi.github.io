/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {},
  },
  env: {
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    // other variables...
  },
};

module.exports = nextConfig;
