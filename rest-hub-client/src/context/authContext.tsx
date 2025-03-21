'use client';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

import { AUTH_EFFECT_EXCLUDED_ROUTES, HTTP_STATUS_CODES, ROUTES } from '@/constants';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { User } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { removeTokens, saveTokens } from '@/utils/authUtils';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const shouldSkipEffect = AUTH_EFFECT_EXCLUDED_ROUTES.includes(pathname);

  useEffect(() => {
    if (shouldSkipEffect) {
      return;
    }

    const getUser = async (): Promise<User> => {
      try {
        const { data } = await apiRequest(async (accessToken: string) => {
          return api.get(API_ENDPOINTS.USER, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }, logout);

        return data.body;
      } catch (error) {
        console.error('Fetching user failed', error);
        throw error;
      }
    };

    getUser().then((user) => {
      setUser(user);
      setIsAuthReady(true);
    });
  }, []);

  const login = async (requestData: LogInUserRequest): Promise<boolean> => {
    try {
      const { data } = await api.post(API_ENDPOINTS.LOGIN, requestData);
      const { tokens, user } = data.body;

      saveTokens(tokens.accessToken, tokens.refreshToken);
      setUser(user);
      router.push(ROUTES.HOME);

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
      const { data } = await api.post(API_ENDPOINTS.SIGNUP, requestData);
      const { tokens, user } = data.body;

      saveTokens(tokens.accessToken, tokens.refreshToken);
      setUser(user);
      router.push(ROUTES.HOME);

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
    <AuthContext.Provider value={{ user, isAuthReady, setUser, login, signup, logout }}>
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
