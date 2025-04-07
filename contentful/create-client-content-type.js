require('dotenv').config();
const contentful = require('contentful-management');

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function createClientContentType() {
  try {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
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
