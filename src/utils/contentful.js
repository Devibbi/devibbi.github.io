import { createClient } from 'contentful';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// Create the client only if we have required config
let client = null;
let previewClient = null;

try {
  if (publicRuntimeConfig.CONTENTFUL_SPACE_ID && publicRuntimeConfig.CONTENTFUL_ACCESS_TOKEN) {
    client = createClient({
      space: publicRuntimeConfig.CONTENTFUL_SPACE_ID,
      accessToken: publicRuntimeConfig.CONTENTFUL_ACCESS_TOKEN,
    });
  }

  if (publicRuntimeConfig.CONTENTFUL_SPACE_ID && publicRuntimeConfig.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    previewClient = createClient({
      space: publicRuntimeConfig.CONTENTFUL_SPACE_ID,
      accessToken: publicRuntimeConfig.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      host: 'preview.contentful.com',
    });
  }
} catch (error) {
  console.error('Failed to initialize Contentful client:', error);
}

export { client, previewClient };

// Safely call Contentful
export const fetchEntries = async (params) => {
    if (!client) return { items: [] };
    try {
        return await client.getEntries(params);
    } catch (error) {
        console.error('Error fetching entries:', error);
        return { items: [] };
    }
};

// Fetch Blog Posts
export const fetchBlogPosts = async () => {
    const response = await client.getEntries({ content_type: 'blogPost' });
    return response.items;
};

// Fetch Skills
export const fetchSkills = async () => {
    const response = await client.getEntries({ content_type: 'skill' });
    return response.items;
};

// Fetch Home Page Content
export const fetchHomePage = async () => {
    const response = await fetchEntries({ content_type: 'homePage' });
    return response.items[0]; // Assuming only one home page entry
};

// Fetch Contact Form
export const fetchContactForm = async () => {
    const response = await client.getEntries({ content_type: 'contactForm' });
    return response.items;
};

// Fetch Navbar Links
export const fetchNavbarLinks = async () => {
    const response = await client.getEntries({ content_type: 'navbarLink' });
    return response.items;
};
