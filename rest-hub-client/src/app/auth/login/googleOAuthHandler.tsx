'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

import { ROUTES, SESSION_STATUS } from '@/constants';
import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { saveTokens } from '@/utils/authUtils';

export default function GoogleOAuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser } = useAuth();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  const fromOAuth = searchParams?.get('fromOAuth') === 'true'; // ✅ 핵심 분기 조건

  useEffect(() => {
    if (
      hasRun.current ||
      !fromOAuth || // ❗ 쿼리 없으면 실행 안 함
      status !== SESSION_STATUS.AUTHENTICATED ||
      !session?.user?.id_token
    ) {
      return;
    }

    hasRun.current = true;

    const authenticateWithBackend = async () => {
      try {
        const requestData = { id_token: session.user.id_token };

        const { data } = await api.post(API_ENDPOINTS.OAUTH_GOOGLE, requestData);

        const { tokens, user } = data.body;

        saveTokens(tokens.accessToken, tokens.refreshToken);
        setUser({ ...user });

        router.push(ROUTES.HOME);
      } catch (error) {
        console.error('Google authentication failed:', error);
      }
    };

    authenticateWithBackend();
  }, [router, session, status, setUser]);

  return null;
}
