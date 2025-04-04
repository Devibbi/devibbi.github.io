import { createClient } from 'contentful';

// Create the client only if we're in a browser OR if the required environment variables are available
let client = null;
let previewClient = null;

// Only log in development
if (process.env.NODE_ENV === 'development') {
    console.log("Space ID:", process.env.CONTENTFUL_SPACE_ID);
    console.log("Access Token:", process.env.CONTENTFUL_ACCESS_TOKEN);
}

try {
    if (typeof window !== 'undefined' || (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN)) {
        client = createClient({
            space: process.env.CONTENTFUL_SPACE_ID,
            accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        });
    }

    if (typeof window !== 'undefined' || (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN)) {
        previewClient = createClient({
            space: process.env.CONTENTFUL_SPACE_ID,
            accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
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
