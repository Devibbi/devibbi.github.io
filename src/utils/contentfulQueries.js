import { createClient } from 'contentful';
import { testEnvVariables } from './envTest';

// Test environment variables and get values
const envVars = testEnvVariables();

// Add debug logging for environment variables
console.log('Environment check results:', {
    spaceIdExists: !!envVars.spaceId,
    accessTokenExists: !!envVars.accessToken
});

if (!envVars.spaceId || !envVars.accessToken) {
    throw new Error(
        'Please provide required Contentful credentials in your .env.local file. Missing: ' +
        (!envVars.spaceId ? 'CONTENTFUL_SPACE_ID ' : '') +
        (!envVars.accessToken ? 'CONTENTFUL_ACCESS_TOKEN' : '')
    );
}

const client = createClient({
    space: envVars.spaceId,
    accessToken: envVars.accessToken,
});

export async function getPersonalInfo() {
    try {
        console.log('Fetching personal info...');
        const response = await client.getEntries({
            content_type: 'personalInfo',
            limit: 1,
        });
        console.log('Personal info fetched:', !!response.items[0]);
        return response.items[0];
    } catch (error) {
        console.error('Error fetching personal info:', error);
        return null;
    }
}

export async function getAllSkills() {
    try {
        console.log('Fetching skills...');
        const response = await client.getEntries({
            content_type: 'skill',
        });
        console.log('Skills fetched:', response.items.length);
        return response.items;
    } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
    }
}

export async function getAllProjects() {
    const response = await client.getEntries({
        content_type: 'project',
    });
    return response.items;
}

export async function getAllBlogPosts() {
    try {
        console.log('Fetching blog posts...');
        const response = await client.getEntries({
            content_type: 'blogPost',
            order: '-fields.publishDate',
            include: 2, // Include nested entries up to 2 levels deep
        });
        console.log('Blog posts fetched:', response.items.length);
        return response.items;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function getBlogPostBySlug(slug) {
    try {
        console.log('Fetching blog post by slug:', slug);
        const response = await client.getEntries({
            content_type: 'blogPost',
            'fields.slug': slug,
            limit: 1,
            include: 2, // Include nested entries up to 2 levels deep
        });
        console.log('Blog post found:', !!response.items[0]);
        return response.items[0];
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function getContactInfo() {
    try {
        console.log('Fetching contact info...');
        const response = await client.getEntries({
            content_type: 'contactInfo',
            limit: 1,
        });
        console.log('Contact info fetched:', !!response.items[0]);
        return response.items[0];
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return null;
    }
} 