/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    middleware: true
  },
  images: {
    domains: [
      'images.ctfassets.net', // Allow Contentful image domains
      'images.unsplash.com', // Allow Unsplash images
      'res.cloudinary.com', // Allow Cloudinary images (used by dev.to)
      'dev-to-uploads.s3.amazonaws.com', // Allow dev.to S3 images
      'dev.to', // Allow dev.to itself
      'lh3.googleusercontent.com', // Allow Google images
    ],
  },
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  },
};

export default nextConfig;
