'use client';

import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

import HamburgerButton from '@/components/layout/hamburgerButton';
import Sidebar from '@/components/layout/sidebar';
import { AuthProvider } from '@/context/authContext';
import { ModalProvider } from '@/context/modalContext';
import { PostProvider } from '@/context/postContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <HamburgerButton onClick={setIsSidebarOpen} />

                {/* 사이드바 */}
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                {isSidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                {/* 메인 콘텐츠 */}
                {children}
              </ModalProvider>
            </PostProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  );
}
