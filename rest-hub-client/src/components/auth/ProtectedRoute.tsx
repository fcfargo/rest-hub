'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, isAuthReady]);

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
