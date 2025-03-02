'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { SESSION_STATUS } from '@/constants';
import { useAuth } from '@/context/authContext';
import api from '@/libs/axiosInstance';
import { saveTokens } from '@/utils/authUtils';

export default function GoogleOAuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    if (status !== SESSION_STATUS.AUTHENTICATED && !session?.user?.id_token) {
      return;
    }

    const authenticateWithBackend = async () => {
      try {
        const requestData = { id_token: session.user.id_token };

        const { data } = await api.post('/users/auth/google', requestData);

        const { tokens, user } = data.body;

        saveTokens(tokens.accessToken, tokens.refreshToken);
        setUser({ ...user, isOAuth: true });

        router.push('/');
      } catch (error) {
        console.error('Google authentication failed:', error);
      }
    };

    authenticateWithBackend();
  }, [router, session, status, setUser]);

  return null;
}
