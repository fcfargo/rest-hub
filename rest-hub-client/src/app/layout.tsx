'use client';

import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

import InnerLayout from '@/components/layout/innerLayout';
import { AuthProvider } from '@/context/authContext';
import { ModalProvider } from '@/context/modalContext';
import { PostProvider } from '@/context/postContext';
import { SidebarProvider } from '@/context/sidebarContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <SessionProvider>
      <AuthProvider>
        <SidebarProvider>
          <html lang="en">
            <head>
              <link rel="manifest" href="/manifest.json" />
              <meta name="theme-color" content="#000000" />
              <link rel="icon" href="/icons/icon-192x192.png" />
              <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={`antialiased flex h-screen`}>
              <PostProvider>
                <ModalProvider>
                  <InnerLayout>{children}</InnerLayout>
                </ModalProvider>
              </PostProvider>
            </body>
          </html>
        </SidebarProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
