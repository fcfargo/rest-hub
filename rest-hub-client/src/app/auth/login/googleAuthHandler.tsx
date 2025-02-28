'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { SESSION_STATUS } from '@/constants';
import api from '@/libs/axiosInstance';
import { saveTokens } from '@/utils/authUtils';

export default function GoogleAuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== SESSION_STATUS.AUTHENTICATED && !session?.user?.id_token) {
      return;
    }

    const authenticateWithBackend = async () => {
      try {
        const requestData = { id_token: session.user.id_token };

        const { data } = await api.post('/auth/google', requestData);

        const { accessToken, refreshToken } = data.body;
        saveTokens(accessToken, refreshToken);

        router.push('/');
      } catch (error) {
        console.error('Google authentication failed:', error);
      }
    };

    authenticateWithBackend();
  }, [router, session, status]);

  return null;
}
