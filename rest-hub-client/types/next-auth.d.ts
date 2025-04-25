import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id_token?: string;
    };
  }

  interface User {
    id_token?: string;
    email?: string;
    name?: string;
  }

  interface JWT {
    id_token?: string;
  }
}
