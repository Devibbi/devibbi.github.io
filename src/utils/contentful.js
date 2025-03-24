import { createClient } from 'contentful';

console.log("Space ID:", process.env.CONTENTFUL_SPACE_ID);
console.log("Access Token:", process.env.CONTENTFUL_ACCESS_TOKEN);

export const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export const previewClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    host: 'preview.contentful.com',
});

export const getClient = (preview) => (preview ? previewClient : client);

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
    const response = await client.getEntries({ content_type: 'homePage' });
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
