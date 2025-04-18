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

    const shouldFetchUser = pathname === ROUTES.HOME || pathname.startsWith(`${ROUTES.USERS}/`);

    if (shouldFetchUser) {
      getUser();
    }
  }, [pathname]);
};
