import { useState, useEffect } from 'react';

export function useIsTabletOrMobile(breakpoint = 1024) {
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsTabletOrMobile(window.innerWidth <= breakpoint);
    }

    handleResize(); // 처음에도 실행
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isTabletOrMobile;
}
