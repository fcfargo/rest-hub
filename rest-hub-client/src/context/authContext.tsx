'use client';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

import { AUTH_EFFECT_EXCLUDED_ROUTES, HTTP_STATUS_CODES } from '@/constants';
import api from '@/libs/axiosInstance';
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from '@/utils/authUtils';

interface User {
  id: number;
  username: string;
  email: string;
  profileImage: string | null;
  deviceToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  isOAuth?: boolean;
}

interface LogInUserRequest {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (requestData: LogInUserRequest) => Promise<boolean>;
  signup: (requestData: LogInUserRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const shouldSkipEffect = AUTH_EFFECT_EXCLUDED_ROUTES.includes(pathname);

  useEffect(() => {
    if (shouldSkipEffect) {
      return;
    }

    const getUser = async () => {
      const accessToken = getAccessToken();
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
        const status = error.response?.status ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

        if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
          console.warn('Access token expired, attempting refresh...');
          await refreshAccessToken();
        } else {
          console.error('Fetching user failed', error);
          logout();
        }
      }
    };

    getUser();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await api.post('users/auth/refresh', { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.body;

      saveTokens(newAccessToken, newRefreshToken);

      const { data: refreshedData } = await api.get('users/auth/me', {
        headers: { Authorization: `Bearer ${newAccessToken}` },
      });

      setUser(refreshedData.body);
    } catch (error) {
      console.error('Refresh token failed: expired or invalid:', error);
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
      const status = error.response?.status ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if ([HTTP_STATUS_CODES.UNAUTHORIZED, HTTP_STATUS_CODES.BAD_REQUEST].includes(status)) {
        console.error('Login failed: Unauthorized', error);
        return false;
      }

      throw new Error(error.message);
    }
  };

  const signup = async (requestData: LogInUserRequest): Promise<boolean> => {
    try {
      const { data } = await api.post('/users/auth/signup', requestData);
      const { tokens, user } = data.body;

      saveTokens(tokens.accessToken, tokens.refreshToken);
      setUser(user);
      router.push('/');

      return true;
    } catch (error) {
      const status = error.response?.status ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if ([HTTP_STATUS_CODES.BAD_REQUEST].includes(status)) {
        console.error('Signup failed: Email already in use', error);
        return false;
      }

      throw new Error(error.message);
    }
  };

  const logout = () => {
    if (user?.isOAuth) {
      signOut({ callbackUrl: '/auth/login' });
    } else {
      setUser(null);
      removeTokens();
      router.push('/auth/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
