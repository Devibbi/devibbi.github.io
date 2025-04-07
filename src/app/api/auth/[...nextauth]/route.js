import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import RedditProvider from 'next-auth/providers/reddit';
import { createClient } from 'contentful-management';

// Initialize Contentful Management client
const contentfulClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

// Function to save client data to Contentful
async function saveClientToContentful(user) {
  try {
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    // Check if client already exists
    const entries = await environment.getEntries({
      content_type: 'client',
      'fields.email': user.email,
    });
    
    if (entries.items.length > 0) {
      // Client already exists, update last login
      const entry = entries.items[0];
      entry.fields.lastLogin = {
        'en-US': new Date().toISOString(),
      };
      await entry.update();
      return entry;
    }
    
    // Create new client entry
    const entry = await environment.createEntry('client', {
      fields: {
        name: {
          'en-US': user.name,
        },
        email: {
          'en-US': user.email,
        },
        image: {
          'en-US': user.image,
        },
        provider: {
          'en-US': user.provider,
        },
        lastLogin: {
          'en-US': new Date().toISOString(),
        },
        messages: {
          'en-US': [],
        },
      },
    });
    
    // Publish the entry
    await entry.publish();
    return entry;
  } catch (error) {
    console.error('Error saving client to Contentful:', error);
    return null;
  }
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user && user.email) {
        // Add provider info to user object
        user.provider = account.provider;
        
        // Save client data to Contentful
        await saveClientToContentful(user);
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: '/client/login',
    signOut: '/',
    error: '/client/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
