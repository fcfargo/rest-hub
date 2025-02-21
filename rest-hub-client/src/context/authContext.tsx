'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // api 서버 인증 기능 완성 후 데이터 fetch 로직으로 변경할 예정
        // const token = localStorage.getItem('token');
        // if (!token) {
        //   setUser(null);
        //   router.push('/login');
        //   return;
        // }

        // const res = await fetch('/api/auth/me', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`, // ✅ JWT 토큰 포함
        //   },
        // });
        const res = {
          ok: true,
          data: {
            user: {
              id: 1,
              email: 'fcfargo90@gmail.com',
              username: 'fcfargo',
              profileImage: '/layout/sidebar/profile-default.svg',
            },
          },
        };
        // const res = {
        //   ok: false,
        //   data: {
        //     user: {
        //       id: 1,
        //       email: 'fcfargo90@gmail.com',
        //       username: 'fcfargo',
        //       profileImage: '/layout/sidebar/profile-default.svg',
        //     },
        //   },
        // };
        if (res.ok) {
          // const data = await res.json();
          const { data } = res;
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem('token'); // 인증 실패 시 토큰 제거
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // api 서버 인증 기능 완성 후 데이터 fetch 로직으로 변경할 예정
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });

      const res = {
        ok: true,
        data: {
          user: {
            id: 1,
            email: 'fcfargo90@gmail.com',
            username: 'fcfargo',
            profileImage: '/layout/sidebar/profile-default.svg',
          },
        },
      };
      if (res.ok) {
        // const { user, token } = await res.json();
        const { data } = res;
        // localStorage.setItem('token', token);
        setUser(data.user);
        router.push('/');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
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
