import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from 'contentful-management';

// Initialize Contentful Management client
const contentfulClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

async function saveClientToContentful(user) {
  try {
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    const entries = await environment.getEntries({
      content_type: 'client',
      'fields.email': user.email
    });

    if (entries.items.length === 0) {
      const entry = await environment.createEntry('client', {
        fields: {
          name: { 'en-US': user.name },
          email: { 'en-US': user.email },
          image: { 'en-US': user.image },
          provider: { 'en-US': user.provider }
        }
      });
      await entry.publish();
      return entry.sys.id;
    }
    return entries.items[0].sys.id;
  } catch (error) {
    console.error('Error saving client to Contentful:', error);
    return null;
  }
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider) {
        user.provider = account.provider;
        await saveClientToContentful(user);
      }
      return true;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);