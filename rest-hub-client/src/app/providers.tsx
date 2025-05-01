'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

import InnerLayout from '@/components/layout/innerLayout';
import { AuthProvider } from '@/context/authContext';
import { ModalProvider } from '@/context/modalContext';
import { PostProvider } from '@/context/postContext';
import { SidebarProvider } from '@/context/sidebarContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((reg) => console.log('✅ Service Worker 등록 완료:', reg))
          .catch((err) => console.error('❌ 등록 실패:', err));
      });
    }
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <SessionProvider>
      <AuthProvider>
        <SidebarProvider>
          <PostProvider>
            <ModalProvider>
              <InnerLayout>{children}</InnerLayout>
            </ModalProvider>
          </PostProvider>
        </SidebarProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
