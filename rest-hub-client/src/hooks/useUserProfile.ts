import { useEffect, useState } from 'react';

import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { User } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

export function useUserProfile(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await apiRequest(async (accessToken: string) => {
          return api.get(`${API_ENDPOINTS.USER}/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }, logout);

        if (isMounted) {
          setUser(data.body);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        if (isMounted) {
          setError('유저 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { user, loading, error };
}
