require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');

async function updateBlogContentType() {
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN || !process.env.CONTENTFUL_SPACE_ID) {
        console.error('Missing environment variables. Make sure CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID are set in your .env.local file.');
        process.exit(1);
    }

    const client = contentful.createClient({
        accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    });

    try {
        console.log('Connecting to Contentful...');
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment('master');
        console.log('Connected to Contentful successfully.');

        // Get the blogPost content type
        console.log('Getting blogPost content type...');
        const contentType = await environment.getContentType('blogPost');

        // Check if externalUrl field already exists
        const externalUrlField = contentType.fields.find(field => field.id === 'externalUrl');

        if (!externalUrlField) {
            console.log('Adding externalUrl field to blogPost content type...');

            // Add the externalUrl field
            contentType.fields.push({
                id: 'externalUrl',
                name: 'External URL',
                type: 'Symbol',
                localized: false,
                required: false,
                validations: [
                    {
                        regexp: {
                            pattern: '^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\\.)+[a-zA-Z]{2,}(\\/[a-zA-Z0-9\\-._~:/?#[\\]@!$&\'()*+,;=%]*)?$',
                            flags: null
                        }
                    }
                ],
                disabled: false,
                omitted: false
            });

            // Update the content type
            const updatedContentType = await contentType.update();

            // Publish the content type
            await updatedContentType.publish();

            console.log('✅ Added externalUrl field to blogPost content type successfully!');
        } else {
            console.log('externalUrl field already exists in blogPost content type.');
        }
    } catch (error) {
        console.error('Error updating blogPost content type:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the script
updateBlogContentType(); 