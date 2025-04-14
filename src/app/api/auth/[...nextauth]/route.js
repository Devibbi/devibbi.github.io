import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import RedditProvider from 'next-auth/providers/reddit';
import { createClient } from 'contentful-management';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_ID,
      clientSecret: process.env.REDDIT_SECRET,
      authorization: {
        params: {
          duration: 'permanent'
        }
      }
    })
  ],
  pages: {
    signIn: '/client/login',
    error: '/client/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const client = createClient({
          accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
        });
        
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment('master');
        
        // Check if user exists in Contentful
        // If not, create new entry
        
        return true;
      } catch (err) {
        console.error('SignIn error:', err);
        return false;
      }
    },
    async session({ session, token }) {
      // Add custom session properties
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };