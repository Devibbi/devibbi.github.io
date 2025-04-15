import { client } from './contentful';

// Add debug logging for environment variables
if (process.env.NODE_ENV === 'development') {
    console.log('Environment check results:', {
        spaceIdExists: !!process.env.CONTENTFUL_SPACE_ID,
        accessTokenExists: !!process.env.CONTENTFUL_ACCESS_TOKEN
    });
}

// Safely execute Contentful queries
const safelyQueryContentful = async (queryFn) => {
    if (!client) return null;
    try {
        return await queryFn();
    } catch (error) {
        console.error('Contentful query error:', error);
        return null;
    }
};

export async function getAllSkills() {
    return safelyQueryContentful(async () => {
        console.log('Fetching skills...');
        const response = await client.getEntries({
            content_type: 'skill',
        });
        console.log('Skills fetched:', response.items.length);
        return response.items;
    }) || [];
}

export async function getPersonalInfo() {
    return safelyQueryContentful(async () => {
        console.log('Fetching personal info...');
        const response = await client.getEntries({
            content_type: 'personalInfo',
            limit: 1,
        });
        console.log('Personal info fetched:', !!response.items[0]);
        return response.items[0];
    }) || null;
}

export async function getAllProjects() {
    return safelyQueryContentful(async () => {
        const response = await client.getEntries({
            content_type: 'project',
        });
        return response.items;
    }) || [];
}

export async function getAllBlogPosts() {
    return safelyQueryContentful(async () => {
        console.log('Fetching blog posts...');
        const response = await client.getEntries({
            content_type: 'blogPost',
            order: '-fields.publishDate',
            include: 2, // Include nested entries up to 2 levels deep
        });

        console.log('Blog posts fetched:', response.items.length);

        // Add more debugging information in development
        if (process.env.NODE_ENV === 'development' && response.items.length > 0) {
            console.log('First blog post ID:', response.items[0].sys.id);
            console.log('First blog post available fields:', Object.keys(response.items[0].fields).join(', '));

            // Check for externalUrl field specifically
            const hasExternalUrl = response.items.some(item => item.fields && item.fields.externalUrl);
            console.log('Any blog post has externalUrl field:', hasExternalUrl);

            // Check image structure
            if (response.items[0].fields.featuredImage) {
                console.log('Featured image type:', typeof response.items[0].fields.featuredImage);

                if (typeof response.items[0].fields.featuredImage === 'object') {
                    console.log('Featured image keys:', Object.keys(response.items[0].fields.featuredImage).join(', '));

                    if (response.items[0].fields.featuredImage.sys) {
                        console.log('Featured image sys type:', response.items[0].fields.featuredImage.sys.type);
                    }

                    if (response.items[0].fields.featuredImage.fields) {
                        console.log('Featured image fields:', Object.keys(response.items[0].fields.featuredImage.fields).join(', '));
                    }
                }
            }
        }

        return response.items;
    }) || [];
}

export async function getBlogPostBySlug(slug) {
    return safelyQueryContentful(async () => {
        console.log('Fetching blog post by slug:', slug);
        const response = await client.getEntries({
            content_type: 'blogPost',
            'fields.slug': slug,
            limit: 1,
            include: 2, // Include nested entries up to 2 levels deep
        });
        console.log('Blog post found:', !!response.items[0]);
        return response.items[0];
    }) || null;
}

export async function getContactInfo() {
    return safelyQueryContentful(async () => {
        console.log('Fetching contact info...');
        const response = await client.getEntries({
            content_type: 'contactInfo',
            limit: 1,
        });
        console.log('Contact info fetched:', !!response.items[0]);
        return response.items[0];
    }) || null;
}

export async function getIQQuizHighScores() {
    if (!client) {
        console.warn('Contentful client not initialized. Cannot fetch high scores.');
        return [];
    }

    try {
        console.log('Fetching IQ Quiz high scores...');

        // First, check what content types are available (for debugging)
        try {
            const contentTypeResponse = await client.getContentTypes();
            console.log('Available content types:',
                contentTypeResponse.items.map(ct => ct.sys.id).join(', '));

            // Check if our content type exists
            const response = await client.getEntries({
                content_type: 'iqQuizScore',
                order: '-fields.score',
                limit: 10,
            });
            return response.items;
        } catch (entriesError) {
            if (entriesError?.details?.errors?.[0]?.name === 'unknownContentType') {
                console.warn(`The content type "${entriesError?.details?.errors[0]?.value}" does not exist in Contentful yet.`);
                console.warn(`Run the script: node contentful/create-iq-score-content-type.js`);
                return [];
            }
            throw entriesError;
        }
    } catch (error) {
        console.error('Error in getIQQuizHighScores:', error);
        return [];
    }
}