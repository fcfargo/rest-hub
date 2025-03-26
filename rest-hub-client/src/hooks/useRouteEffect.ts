'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/authContext';

export const useRouteEffect = () => {
  const pathname = usePathname();
  const { getUser } = useAuth();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (pathname === ROUTES.HOME) {
      getUser();
    }
  }, [pathname]);
};
