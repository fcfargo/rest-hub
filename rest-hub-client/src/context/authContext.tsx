'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { BAD_REQUEST_STATUS_CODE, UNAUTHORIZED_STATUS_CODE } from '@/constants';
import api from '@/libs/axiosInstance';

interface User {
  id: number;
  username: string;
  email: string;
  profileImage: string | null;
  deviceToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface LogInUserRequest {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (requestData: LogInUserRequest) => Promise<boolean>;
  logout: () => void;
}

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        logout();
        return;
      }

      try {
        const { data } = await api.get('users/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUser(data.body);
      } catch (error) {
        if (error.response?.status === UNAUTHORIZED_STATUS_CODE) {
          console.warn('Access token expired, attempting refresh...');
          await refreshAccessToken();
        } else {
          console.error('Failed to fetch user:', error);
          logout();
        }
      }
    };

    getUser();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const { data } = await api.post('users/auth/refresh', { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.body;

      saveTokens(newAccessToken, newRefreshToken);

      const { data: refreshedData } = await api.get('users/auth/me', {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });

      setUser(refreshedData.body);
    } catch (error) {
      console.error('Refresh token expired or invalid:', error);
      logout();
    }
  };

  const login = async (requestData: LogInUserRequest): Promise<boolean> => {
    try {
      const { data } = await api.post('/users/auth/signin', requestData);
      const { tokens, user } = data.body;

      saveTokens(tokens.accessToken, tokens.refreshToken);
      setUser(user);
      router.push('/');

      return true;
    } catch (error) {
      if ([UNAUTHORIZED_STATUS_CODE, BAD_REQUEST_STATUS_CODE].includes(error.response?.status)) {
        console.error('Login unauthorized error:', error);
        return false;
      }

      throw new Error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    removeTokens();
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
