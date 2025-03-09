import '@/styles/globals.css';
import Sidebar from '@/components/layout/sidebar';
import { AuthProvider } from '@/context/authContext';
import { ModalProvider } from '@/context/modalContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`antialiased flex h-screen`}>
          <ModalProvider>
            <Sidebar />
            {children}
          </ModalProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
