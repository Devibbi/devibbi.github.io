import { NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { cookies } from 'next/headers';

// Initialize Contentful Management API client
const getContentfulClient = () => {
  if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
    throw new Error('Contentful Management Token not configured');
  }
  return createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  });
};

// Middleware to check admin authentication
async function checkAdminAuth(request) {
  try {
    const cookieStore = await cookies(request);
    const adminSession = await cookieStore.get('admin_session');
    
    console.log('Auth check - adminSession:', adminSession?.value);
    
    if (!adminSession?.value || adminSession.value !== 'true') {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

async function checkEnvVars() {
  const requiredEnvVars = ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_MANAGEMENT_TOKEN'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    return NextResponse.json(
      { error: `Missing env vars: ${missingVars.join(', ')}` },
      { status: 500 }
    );
  }
  return null;
}

export const dynamic = 'force-dynamic';

// Get all client messages
export async function GET(request) {
  try {
    // Verify admin authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Contentful client
    const contentfulClient = getContentfulClient();
    const envError = await checkEnvVars();
    if (envError) return envError;

    try {
      const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
      const environment = await space.getEnvironment('master');
      
      // Get all client message entries
      const entries = await environment.getEntries({
        content_type: 'clientMessage',
        order: '-sys.createdAt',
        include: 2, // Include linked entries (clients)
      });
      
      // Format the messages
      const messagesPromises = entries.items.map(async (entry) => {
        let clientData = null;
        
        // Check if client reference exists
        if (entry.fields.client?.['en-US']) {
          const clientId = entry.fields.client['en-US'].sys.id;
          
          // Check if includes exists and has Entry array
          if (entries.includes && Array.isArray(entries.includes.Entry)) {
            const clientEntry = entries.includes.Entry.find(e => e.sys.id === clientId);
            if (clientEntry) {
              clientData = {
                id: clientEntry.sys.id,
                name: clientEntry.fields.name?.['en-US'] || '',
                email: clientEntry.fields.email?.['en-US'] || '',
                image: clientEntry.fields.image?.['en-US'] || '',
                provider: clientEntry.fields.provider?.['en-US'] || '',
              };
            }
          } else {
            // If includes.Entry is not available, fetch the client entry directly
            try {
              const clientEntry = await environment.getEntry(clientId);
              clientData = {
                id: clientEntry.sys.id,
                name: clientEntry.fields.name?.['en-US'] || '',
                email: clientEntry.fields.email?.['en-US'] || '',
                image: clientEntry.fields.image?.['en-US'] || '',
                provider: clientEntry.fields.provider?.['en-US'] || '',
              };
            } catch (error) {
              console.error(`Error fetching client ${clientId}:`, error);
              clientData = { id: clientId };
            }
          }
        }
        
        return {
          id: entry.sys.id,
          subject: entry.fields.subject?.['en-US'] || '',
          message: entry.fields.message?.['en-US'] || '',
          createdAt: entry.sys.createdAt,
          read: entry.fields.read?.['en-US'] || false,
          client: clientData,
        };
      });
      
      // Resolve all promises
      const messages = await Promise.all(messagesPromises);
      
      // Ensure all client data is properly fetched
      const resolvedMessages = await Promise.all(messages.map(async (message) => {
        if (message.client && message.client.id && (!message.client.name || message.client.name === '')) {
          try {
            const clientEntry = await environment.getEntry(message.client.id);
            return {
              ...message,
              client: {
                id: clientEntry.sys.id,
                name: clientEntry.fields.name?.['en-US'] || 'Unknown',
                email: clientEntry.fields.email?.['en-US'] || '',
                image: clientEntry.fields.image?.['en-US'] || '',
                provider: clientEntry.fields.provider?.['en-US'] || '',
              }
            };
          } catch (error) {
            console.error(`Error fetching client ${message.client.id}:`, error);
            return message;
          }
        }
        return message;
      }));
      
      // Extract unique clients from messages
      const clientsMap = new Map();
      resolvedMessages.forEach(message => {
        if (message.client && message.client.id) {
          clientsMap.set(message.client.id, message.client);
        }
      });
      
      const clients = Array.from(clientsMap.values());

      return NextResponse.json({ messages: resolvedMessages, clients });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Mark a message as read
export async function PATCH(request) {
  try {
    // Initialize Contentful client
    const contentfulClient = getContentfulClient();
    const envError = await checkEnvVars();
    if (envError) return envError;

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
      const updatedEntry = await entry.update();
      
      try {
        // Try to publish the entry
        await updatedEntry.publish();
      } catch (publishError) {
        // If there's a version conflict, get the latest version and try again
        if (publishError.status === 409) {
          const latestEntry = await environment.getEntry(messageId);
          latestEntry.fields.read = {
            'en-US': read !== undefined ? read : true,
          };
          const latestUpdatedEntry = await latestEntry.update();
          await latestUpdatedEntry.publish();
        } else {
          throw publishError;
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating message:', error);
      return NextResponse.json({ message: 'Error updating message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Send a response to a client
export async function POST(request) {
  try {
    // Initialize Contentful client
    const contentfulClient = getContentfulClient();
    const envError = await checkEnvVars();
    if (envError) return envError;

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
      
      // Create a new client message entry
      const newMessage = await environment.createEntry('clientMessage', {
        fields: {
          client: {
            'en-US': {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: clientId
              }
            }
          },
          message: { 'en-US': message },
          isAdminResponse: { 'en-US': true },
          createdAt: { 'en-US': new Date().toISOString() }
        }
      });

      await newMessage.publish();
      
      return NextResponse.json({ success: true, responseId: entry.sys.id });
    } catch (error) {
      console.error('Error sending response:', error);
      return NextResponse.json({ message: 'Error sending response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
