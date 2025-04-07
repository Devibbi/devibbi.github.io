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

async function createClientContentType() {
  try {
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment('master');

    // Create Client Content Type
    const clientContentType = await environment.createContentTypeWithId('client', {
      name: 'Client',
      description: 'Clients who have logged in to the website',
      displayField: 'name',
      fields: [
        {
          id: 'name',
          name: 'Name',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'email',
          name: 'Email',
          type: 'Symbol',
          required: true,
          validations: [
            {
              unique: true,
            },
          ],
        },
        {
          id: 'image',
          name: 'Profile Image',
          type: 'Symbol',
          required: false,
        },
        {
          id: 'provider',
          name: 'Auth Provider',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'lastLogin',
          name: 'Last Login',
          type: 'Date',
          required: true,
        },
        {
          id: 'messages',
          name: 'Messages',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['clientMessage'],
              },
            ],
          },
        },
      ],
    });

    // Publish the content type
    await clientContentType.publish();
    console.log('Client content type created and published successfully!');

    // Create Client Message Content Type
    const messageContentType = await environment.createContentTypeWithId('clientMessage', {
      name: 'Client Message',
      description: 'Messages sent by clients',
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
        {
          id: 'read',
          name: 'Read',
          type: 'Boolean',
          required: true,
        },
      ],
    });

    // Publish the content type
    await messageContentType.publish();
    console.log('Client Message content type created and published successfully!');

  } catch (error) {
    console.error('Error creating content types:', error);
  }
}

createClientContentType();
