# Contentful Management Scripts

This folder contains scripts to manage your Contentful content.

## Adding Blog Posts from Dev.to

To add your Dev.to blog posts to Contentful, run the following command in PowerShell:

```powershell
# Navigate to your project directory
cd C:\Users\askib\OneDrive\Desktop\work\devibbi.github.io-main (1)\latest portfolio\devibbi.github.io

# Run the script
node .\contentful\add-blog-posts-fixed.js
```

## Updating Content Types

To update the blog post content type with an external URL field, run:

```powershell
# Navigate to your project directory
cd C:\Users\askib\OneDrive\Desktop\work\devibbi.github.io-main (1)\latest portfolio\devibbi.github.io

# Run the script
node .\contentful\update-blog-content-type.js
```

## Adding Development Tools Skills

To add development tools skills to Contentful, run:

```powershell
# Navigate to your project directory
cd C:\Users\askib\OneDrive\Desktop\work\devibbi.github.io-main (1)\latest portfolio\devibbi.github.io

# Run the script
node .\contentful\add-tools-skills.js
```

## Troubleshooting

If you encounter errors, check:

1. Your .env.local file has all the required environment variables
2. You have the contentful-management package installed
3. You have proper permissions in your Contentful space 