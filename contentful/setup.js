require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');

const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function createContentTypes() {
    try {
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment('master');

        // Personal Info Content Type
        await environment.createContentTypeWithId('personalInfo', {
            name: 'Personal Info',
            fields: [
                { id: 'name', name: 'Name', type: 'Symbol', required: true },
                { id: 'title', name: 'Professional Title', type: 'Symbol', required: true },
                { id: 'bio', name: 'Bio', type: 'Text', required: true },
                { id: 'profileImage', name: 'Profile Image', type: 'Link', linkType: 'Asset', required: true },
                { id: 'resumeUrl', name: 'Resume URL', type: 'Symbol' },
            ],
        });

        // Skills Content Type
        await environment.createContentTypeWithId('skill', {
            name: 'Skill',
            fields: [
                { id: 'category', name: 'Category', type: 'Symbol', required: true },
                { id: 'skills', name: 'Skills', type: 'Array', items: { type: 'Symbol' }, required: true },
                { id: 'icon', name: 'Category Icon', type: 'Symbol' },
            ],
        });

        // Project Content Type
        await environment.createContentTypeWithId('project', {
            name: 'Project',
            fields: [
                { id: 'title', name: 'Title', type: 'Symbol', required: true },
                { id: 'description', name: 'Description', type: 'Text', required: true },
                { id: 'image', name: 'Project Image', type: 'Link', linkType: 'Asset', required: true },
                { id: 'technologies', name: 'Technologies Used', type: 'Array', items: { type: 'Symbol' } },
                { id: 'githubUrl', name: 'GitHub URL', type: 'Symbol' },
                { id: 'liveUrl', name: 'Live Demo URL', type: 'Symbol' },
            ],
        });

        // Blog Post Content Type
        await environment.createContentTypeWithId('blogPost', {
            name: 'Blog Post',
            fields: [
                { id: 'title', name: 'Title', type: 'Symbol', required: true },
                { id: 'slug', name: 'Slug', type: 'Symbol', required: true },
                { id: 'featuredImage', name: 'Featured Image', type: 'Link', linkType: 'Asset', required: true },
                { id: 'excerpt', name: 'Excerpt', type: 'Text', required: true },
                { id: 'content', name: 'Content', type: 'RichText', required: true },
                { id: 'publishDate', name: 'Publish Date', type: 'Date', required: true },
                { id: 'tags', name: 'Tags', type: 'Array', items: { type: 'Symbol' } },
            ],
        });

        // Contact Information Content Type
        await environment.createContentTypeWithId('contactInfo', {
            name: 'Contact Information',
            fields: [
                { id: 'email', name: 'Email', type: 'Symbol', required: true },
                { id: 'phone', name: 'Phone', type: 'Symbol' },
                { id: 'location', name: 'Location', type: 'Symbol' },
                { id: 'socialLinks', name: 'Social Links', type: 'Object' },
            ],
        });

        console.log('Content types created successfully!');
    } catch (error) {
        console.error('Error creating content types:', error);
    }
}

createContentTypes(); 