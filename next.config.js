/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {},
  },
  reactStrictMode: true,
  images: {
    domains: ['images.ctfassets.net'],
  },
  env: {
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // other variables...
  },
};

module.exports = nextConfig;
