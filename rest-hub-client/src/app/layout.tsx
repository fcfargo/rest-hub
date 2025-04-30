import '@/styles/globals.css';

import Providers from './providers';

export const metadata = {
  title: 'Rest Hub',
  description: '쉬는 청년들을 위한 공간',
  themeColor: '#000000',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased flex h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
