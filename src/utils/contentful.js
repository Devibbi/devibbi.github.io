import { createClient } from 'contentful';

// Helper to get env vars safely
function getEnvVar(key) {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    return undefined;
}

// Defensive: Check for Contentful credentials
const spaceId = getEnvVar('NEXT_PUBLIC_CONTENTFUL_SPACE_ID');
const accessToken = getEnvVar('NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN');
const previewSpaceId = getEnvVar('CONTENTFUL_SPACE_ID');
const previewAccessToken = getEnvVar('CONTENTFUL_PREVIEW_ACCESS_TOKEN');

let client = null;
let previewClient = null;

if (!spaceId || !accessToken) {
    if (typeof window !== 'undefined') {
        // Client-side: show user-friendly message
        alert('Contentful credentials missing! Please set NEXT_PUBLIC_CONTENTFUL_SPACE_ID and NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN in your environment.');
    } else {
        // Server-side: log error
        console.error('Missing Contentful credentials: NEXT_PUBLIC_CONTENTFUL_SPACE_ID and/or NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN');
    }
} else {
    try {
        client = createClient({
            space: spaceId,
            accessToken: accessToken,
        });
    } catch (error) {
        console.error('Failed to initialize Contentful client:', error);
    }
}

if (previewSpaceId && previewAccessToken) {
    try {
        previewClient = createClient({
            space: previewSpaceId,
            accessToken: previewAccessToken,
            host: 'preview.contentful.com',
        });
    } catch (error) {
        console.error('Failed to initialize Contentful preview client:', error);
    }
}

// Defensive fetchEntries
export const fetchEntries = async (params) => {
    if (!client) {
        if (typeof window !== 'undefined') {
            alert('Contentful client not initialized. Content may not load.');
        }
        return { items: [] };
    }
    try {
        return await client.getEntries(params);
    } catch (error) {
        console.error('Error fetching entries:', error);
        return { items: [] };
    }
};

// Defensive fetch functions
export const fetchBlogPosts = async () => {
    const response = await fetchEntries({ content_type: 'blogPost' });
    return response.items || [];
};

export const fetchSkills = async () => {
    const response = await fetchEntries({ content_type: 'skill' });
    return response.items || [];
};

export const fetchNavbarLinks = async () => {
    const response = await fetchEntries({ content_type: 'navbarLink' });
    return response.items || [];
};

export const fetchContactForm = async () => {
    if (!client) return [];
    try {
        const response = await client.getEntries({ content_type: 'contactForm' });
        return response.items || [];
    } catch (error) {
        console.error('Error fetching contact form:', error);
        return [];
    }
};

export const fetchHomePage = async () => {
    const response = await fetchEntries({ content_type: 'homePage' });
    return response.items ? response.items[0] : null;
};

export { client, previewClient };
