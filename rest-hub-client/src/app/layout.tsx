'use client';

import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';

import Sidebar from '@/components/layout/sidebar';
import { AuthProvider } from '@/context/authContext';
import { ModalProvider } from '@/context/modalContext';
import { PostProvider } from '@/context/postContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <AuthProvider>
        <html lang="en">
          <body className={`antialiased flex h-screen`}>
            <PostProvider>
              <ModalProvider>
                <Sidebar />
                {children}
              </ModalProvider>
            </PostProvider>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  );
}
