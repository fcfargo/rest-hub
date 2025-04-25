'use client';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

import { AUTH_EFFECT_EXCLUDED_ROUTES, HTTP_STATUS_CODES, ROUTES } from '@/constants';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { User } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { removeTokens, saveTokens } from '@/utils/authUtils';
import { getErrorMessage } from '@/utils/errorGuards';

interface LogInUserRequest {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  login: (requestData: LogInUserRequest) => Promise<boolean>;
  signup: (requestData: LogInUserRequest) => Promise<boolean>;
  logout: () => void;
  getUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  if (!pathname) {
    return false;
  }

  const shouldSkipEffect = AUTH_EFFECT_EXCLUDED_ROUTES.includes(pathname);

  useEffect(() => {
    if (shouldSkipEffect) {
      return;
    }

    getUser();
  }, []);

  const getUser = async (): Promise<User> => {
    try {
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.get(API_ENDPOINTS.ME, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      const user = data.body;

      setUser(user);
      setIsAuthReady(true);

      return user;
    } catch (error) {
      console.error('Fetching user failed', error);
      throw error;
    }
  };

  const login = async (requestData: LogInUserRequest): Promise<boolean> => {
    try {
      const { data } = await api.post(API_ENDPOINTS.LOGIN, requestData);
      const { tokens, user } = data.body;

      saveTokens(tokens.accessToken, tokens.refreshToken);
      setUser(user);
      router.push(ROUTES.HOME);

      return true;
    } catch (error) {
      let status: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (isAxiosError(error)) {
        status = error.response?.status ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      const errorStatuses: number[] = [
        HTTP_STATUS_CODES.UNAUTHORIZED,
        HTTP_STATUS_CODES.BAD_REQUEST,
      ];

      if (errorStatuses.includes(status)) {
        console.error('Login failed: Unauthorized', error);
        return false;
      }

      throw new Error(getErrorMessage(error));
    }
  };

  const signup = async (requestData: LogInUserRequest): Promise<boolean> => {
    try {
      const { data } = await api.post(API_ENDPOINTS.SIGNUP, requestData);
      const { tokens, user } = data.body;

      saveTokens(tokens.accessToken, tokens.refreshToken);
      setUser(user);
      router.push(ROUTES.HOME);

      return true;
    } catch (error) {
      let status: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (isAxiosError(error)) {
        status = error.response?.status ?? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      const errorStatuses: number[] = [
        HTTP_STATUS_CODES.UNAUTHORIZED,
        HTTP_STATUS_CODES.BAD_REQUEST,
      ];

      if (errorStatuses.includes(status)) {
        console.error('Signup failed: Email already in use', error);
        return false;
      }

      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async (): Promise<void> => {
    if (user?.socialProvider) {
      await signOut({ callbackUrl: ROUTES.AUTH.LOGIN });
    } else {
      setUser(null);
      removeTokens();
      router.push(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthReady, setUser, login, signup, logout, getUser }}>
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
