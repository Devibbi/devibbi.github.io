// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const contentful = require('contentful-management');

// Log environment variables for debugging (redacted for security)
console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID ? 'Set' : 'Not set');
console.log('CONTENTFUL_MANAGEMENT_TOKEN:', process.env.CONTENTFUL_MANAGEMENT_TOKEN ? 'Set' : 'Not set');

// Check for required environment variables
if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN || !process.env.CONTENTFUL_SPACE_ID) {
    console.error('Missing environment variables. Make sure CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID are set.');
    process.exit(1);
}

// Create Contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function createIQScoreContentType() {
    try {
        // Connect to Contentful
        console.log('Connecting to Contentful...');
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        console.log('Successfully connected to space:', process.env.CONTENTFUL_SPACE_ID);

        const environment = await space.getEnvironment('master');
        console.log('Successfully connected to environment: master');

        // List all content types for debugging
        console.log('Listing all current content types...');
        const contentTypes = await environment.getContentTypes();
        console.log('Current content types:', contentTypes.items.map(ct => `${ct.sys.id} (${ct.name})`));

        // Check if the content type already exists
        let existingContentType = null;
        try {
            existingContentType = await environment.getContentType('iqQuizScore');
            console.log('IQ Quiz Score content type already exists:', existingContentType.sys.id);
            return;
        } catch (error) {
            // Content type doesn't exist, continue to create it
            console.log('Creating new IQ Quiz Score content type...');
        }

        // Create IQ Quiz Score Content Type
        const contentType = await environment.createContentType({
            sys: {
                id: 'iqQuizScore'
            },
            name: 'IQ Quiz Score',
            displayField: 'playerName',
            fields: [
                { id: 'playerName', name: 'Player Name', type: 'Symbol', required: true },
                { id: 'score', name: 'Score', type: 'Integer', required: true },
                { id: 'level', name: 'Achieved Level', type: 'Symbol', required: true },
                { id: 'date', name: 'Date', type: 'Date', required: true },
                { id: 'streak', name: 'Highest Streak', type: 'Integer' },
                { id: 'questionsCorrect', name: 'Questions Answered Correctly', type: 'Integer' },
                { id: 'totalQuestions', name: 'Total Questions', type: 'Integer' },
                { id: 'playerIp', name: 'Player IP', type: 'Symbol' }
            ]
        });

        console.log('Content type created, ID:', contentType.sys.id);

        // Publish the content type
        const publishedContentType = await contentType.publish();
        console.log('✅ IQ Quiz Score content type created and published successfully!');
        console.log('Published content type ID:', publishedContentType.sys.id);

        // List content types again to confirm
        const updatedContentTypes = await environment.getContentTypes();
        console.log('Updated content types:', updatedContentTypes.items.map(ct => `${ct.sys.id} (${ct.name})`));

        return publishedContentType;
    } catch (error) {
        console.error('Error creating IQ Quiz Score content type:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    createIQScoreContentType()
        .then((result) => {
            if (result) {
                console.log('Setup complete with content type ID:', result.sys.id);
            } else {
                console.log('Setup complete (content type already existed or creation failed)');
            }
        })
        .catch(err => {
            console.error('Setup failed:', err);
            process.exit(1);
        });
}

module.exports = { createIQScoreContentType }; 