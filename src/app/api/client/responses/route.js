import { getServerSession } from 'next-auth';
import { createClient } from 'contentful-management';

// Initialize Contentful Management client
const contentfulClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get client responses from Contentful
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

    // Get admin responses for this client
    const responseEntries = await environment.getEntries({
      content_type: 'adminResponse',
      'fields.client.sys.id': clientEntry.sys.id,
      order: '-fields.createdAt',
    });

    // Format the responses
    const responses = responseEntries.items.map(entry => ({
      id: entry.sys.id,
      subject: entry.fields.subject?.['en-US'] || '',
      message: entry.fields.message?.['en-US'] || '',
      createdAt: entry.fields.createdAt?.['en-US'] || '',
    }));

    return Response.json({ responses });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return Response.json({ message: 'Failed to fetch responses' }, { status: 500 });
  }
}
