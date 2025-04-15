import { createClient } from 'contentful';

// HARDCODED Contentful credentials (for emergency/debug use only)
const spaceId = 'poefg0mw3yxo';
const accessToken = 'SjAJFjD_cYCu8cYRdX9XiwkSB2mnjvbuk1F767Ataow';
const previewSpaceId = 'poefg0mw3yxo';
const previewAccessToken = 'CBoLFqKoepbqPp_UfJWMPjnwhSyXGgytQtThU5heqf4';

let client = null;
let previewClient = null;

try {
    client = createClient({
        space: spaceId,
        accessToken: accessToken,
    });
} catch (error) {
    console.error('Failed to initialize Contentful client:', error);
}

try {
    previewClient = createClient({
        space: previewSpaceId,
        accessToken: previewAccessToken,
        host: 'preview.contentful.com',
    });
} catch (error) {
    console.error('Failed to initialize Contentful preview client:', error);
}

// Defensive fetchEntries
export const fetchEntries = async (params) => {
    if (!client) {
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
