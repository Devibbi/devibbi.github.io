import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { createClient } from 'contentful-management';

const getContentfulClient = () => {
  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    throw new Error('Contentful Management Token not configured');
  }
  return createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  });
};

// Get client messages
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const contentfulClient = getContentfulClient();
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');

    // Find client entry
    const clientEntries = await environment.getEntries({
      content_type: 'client',
      'fields.email': session.user.email,
    });

    if (clientEntries.items.length === 0) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    const clientEntry = clientEntries.items[0];

    // Get client messages
    const messageEntries = await environment.getEntries({
      content_type: 'clientMessage',
      'fields.client.sys.id': clientEntry.sys.id,
      order: 'fields.createdAt',
    });

    // Format the messages
    const messages = messageEntries.items.map(entry => ({
      id: entry.sys.id,
      subject: entry.fields.subject?.['en-US'] || '',
      message: entry.fields.message?.['en-US'] || '',
      createdAt: entry.fields.createdAt?.['en-US'] || '',
      read: entry.fields.read?.['en-US'] || false,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const contentfulClient = getContentfulClient();
    const { subject, message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Find client entry
    const clientEntries = await environment.getEntries({
      content_type: 'client',
      'fields.email': session.user.email,
    });

    if (clientEntries.items.length === 0) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    const clientEntry = clientEntries.items[0];

    const entry = await environment.createEntry('clientMessage', {
      fields: {
        subject: { 'en-US': subject },
        message: { 'en-US': message },
        client: { 
          'en-US': { 
            sys: { 
              type: 'Link',
              linkType: 'Entry',
              id: clientEntry.sys.id 
            }
          }
        },
        createdAt: { 'en-US': new Date().toISOString() },
        read: { 'en-US': false }
      }
    });
    
    await entry.publish();
    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error.message || 'Message submission failed' },
      { status: 500 }
    );
  }
}
