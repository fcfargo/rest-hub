import { useEffect } from 'react';

import { useIsTabletOrMobile } from './useIsDesktop';

export function useViewportHeightVar() {
  const isMobileOrTablet = useIsTabletOrMobile();

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    if (!isMobileOrTablet) {
      return;
    }

    setVh();

    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);
}
