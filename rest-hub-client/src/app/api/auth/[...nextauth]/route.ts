import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { ROUTES } from '@/constants';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: ROUTES.AUTH.LOGIN,
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id_token = token.id_token;
      return session;
    },
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}${ROUTES.AUTH.LOGIN}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
