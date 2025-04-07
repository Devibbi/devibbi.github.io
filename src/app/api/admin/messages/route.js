import { NextResponse } from 'next/server';
import { createClient } from 'contentful-management';

// Initialize Contentful Management client
const contentfulClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

// Middleware to check admin authentication
async function checkAdminAuth(request) {
  const adminSession = request.cookies.get('admin_session');
  return adminSession && adminSession.value === 'true';
}

// Get all client messages
export async function GET(request) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Get all client message entries
    const entries = await environment.getEntries({
      content_type: 'clientMessage',
      order: '-fields.createdAt',
      include: 2, // Include linked entries (clients)
    });
    
    // Format the messages
    const messages = entries.items.map(entry => {
      const clientEntry = entry.fields.client?.['en-US'] 
        ? entries.includes.Entry.find(e => e.sys.id === entry.fields.client['en-US'].sys.id)
        : null;
        
      return {
        id: entry.sys.id,
        subject: entry.fields.subject?.['en-US'] || '',
        message: entry.fields.message?.['en-US'] || '',
        createdAt: entry.fields.createdAt?.['en-US'] || '',
        read: entry.fields.read?.['en-US'] || false,
        client: clientEntry ? {
          id: clientEntry.sys.id,
          name: clientEntry.fields.name?.['en-US'] || '',
          email: clientEntry.fields.email?.['en-US'] || '',
          image: clientEntry.fields.image?.['en-US'] || '',
          provider: clientEntry.fields.provider?.['en-US'] || '',
        } : null,
      };
    });
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 });
  }
}

// Mark a message as read
export async function PATCH(request) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { messageId, read } = await request.json();
    
    if (!messageId) {
      return NextResponse.json({ message: 'Message ID is required' }, { status: 400 });
    }
    
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Get the message entry
    const entry = await environment.getEntry(messageId);
    
    // Update the read status
    entry.fields.read = {
      'en-US': read !== undefined ? read : true,
    };
    
    // Update the entry
    await entry.update();
    await entry.publish();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ message: 'Error updating message' }, { status: 500 });
  }
}

// Send a response to a client
export async function POST(request) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { clientId, subject, message } = await request.json();
    
    if (!clientId || !subject || !message) {
      return NextResponse.json({ message: 'Client ID, subject, and message are required' }, { status: 400 });
    }
    
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Create a new admin response entry
    const entry = await environment.createEntry('adminResponse', {
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
              id: clientId,
            },
          },
        },
        createdAt: {
          'en-US': new Date().toISOString(),
        },
      },
    });
    
    // Publish the entry
    await entry.publish();
    
    return NextResponse.json({ success: true, responseId: entry.sys.id });
  } catch (error) {
    console.error('Error sending response:', error);
    return NextResponse.json({ message: 'Error sending response' }, { status: 500 });
  }
}
