'use client';

import HamburgerButton from '@/components/layout/hamburgerButton';
import Overlay from '@/components/layout/overlay';
import Sidebar from '@/components/layout/sidebar';
import { useSidebar } from '@/context/sidebarContext';

export default function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  return (
    <>
      <HamburgerButton />
      <Sidebar />
      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}
      {children}
    </>
  );
}
