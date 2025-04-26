import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { ROUTES } from '@/constants';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';

export default NextAuth({
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
      if (typeof token.id_token === 'string') {
        session.user.id_token = token.id_token;
      } else {
        session.user.id_token = undefined;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}${ROUTES.AUTH.LOGIN}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
