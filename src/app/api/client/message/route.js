import { getServerSession } from 'next-auth';
import { createClient } from 'contentful-management';

// Initialize Contentful Management client
const contentfulClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { subject, message } = await request.json();

    // Validate request
    if (!subject || !message) {
      return Response.json({ message: 'Subject and message are required' }, { status: 400 });
    }

    // Save message to Contentful
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Find client entry
    const clientEntries = await environment.getEntries({
      content_type: 'client',
      'fields.email': session.user.email,
    });

    if (clientEntries.items.length === 0) {
      return Response.json({ message: 'Client not found' }, { status: 404 });
    }

    const clientEntry = clientEntries.items[0];

    // Create message entry
    const messageEntry = await environment.createEntry('clientMessage', {
      fields: {
        subject: {
          'en-US': subject,
        },
        message: {
          'en-US': message,
        },
        client: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: clientEntry.sys.id,
            },
          },
        },
        createdAt: {
          'en-US': new Date().toISOString(),
        },
        read: {
          'en-US': false,
        },
      },
    });

    // Publish the message entry
    await messageEntry.publish();

    // Update client entry with the new message
    const currentMessages = clientEntry.fields.messages?.['en-US'] || [];
    clientEntry.fields.messages = {
      'en-US': [
        ...currentMessages,
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: messageEntry.sys.id,
          },
        },
      ],
    };

    // Update and publish client entry
    await clientEntry.update();
    await clientEntry.publish();

    return Response.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return Response.json({ message: 'Failed to send message' }, { status: 500 });
  }
}
