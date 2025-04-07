// Load environment variables from .env.local file
require('dotenv').config({ path: '.env.local' });
const contentful = require('contentful-management');

// Debug: Print environment variables (without showing full token value)
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN || '';
const spaceId = process.env.CONTENTFUL_SPACE_ID || '';

console.log('Environment variables check:');
console.log('CONTENTFUL_SPACE_ID:', spaceId ? `Found (${spaceId.substring(0, 4)}...)` : 'Not found');
console.log('CONTENTFUL_MANAGEMENT_TOKEN:', managementToken ? `Found (${managementToken.substring(0, 4)}...)` : 'Not found');

if (!managementToken) {
  console.error('Error: CONTENTFUL_MANAGEMENT_TOKEN is missing or empty');
  process.exit(1);
}

if (!spaceId) {
  console.error('Error: CONTENTFUL_SPACE_ID is missing or empty');
  process.exit(1);
}

// Create client with explicit token from environment
const client = contentful.createClient({
  accessToken: managementToken,
});

async function createAdminResponseContentType() {
  try {
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    // Create Admin Response Content Type
    const adminResponseContentType = await environment.createContentTypeWithId('adminResponse', {
      name: 'Admin Response',
      description: 'Responses sent by admin to clients',
      displayField: 'subject',
      fields: [
        {
          id: 'subject',
          name: 'Subject',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'message',
          name: 'Message',
          type: 'Text',
          required: true,
        },
        {
          id: 'client',
          name: 'Client',
          type: 'Link',
          linkType: 'Entry',
          required: true,
          validations: [
            {
              linkContentType: ['client'],
            },
          ],
        },
        {
          id: 'createdAt',
          name: 'Created At',
          type: 'Date',
          required: true,
        },
      ],
    });

    // Publish the content type
    await adminResponseContentType.publish();
    console.log('Admin Response content type created and published successfully!');

  } catch (error) {
    console.error('Error creating content type:', error);
  }
}

createAdminResponseContentType();
