/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
    images: {
      domains: [
        'images.ctfassets.net',
        'images.unsplash.com',
        'res.cloudinary.com',
        'dev-to-uploads.s3.amazonaws.com',
        'dev.to',
        'lh3.googleusercontent.com'
      ],
    },
    env: {
      CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
      CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
      CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      GITHUB_ID: process.env.GITHUB_ID,
      GITHUB_SECRET: process.env.GITHUB_SECRET,
      GOOGLE_ID: process.env.GOOGLE_ID,
      GOOGLE_SECRET: process.env.GOOGLE_SECRET
    }
  };
  
  export default nextConfig;
