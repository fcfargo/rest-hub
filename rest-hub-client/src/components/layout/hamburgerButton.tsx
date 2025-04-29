'use client';

import Image from 'next/image';

import { useModal } from '@/context/modalContext';
import { useSidebar } from '@/context/sidebarContext';
import styles from '@/styles/layout/hamburgerButton.module.css';

export default function HamburgerButton() {
  const { isModalOpen } = useModal();
  const { setIsSidebarOpen } = useSidebar();

  if (isModalOpen) {
    return null;
  }

  return (
    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className={styles.hamburgerButton}>
      <Image
        className={styles.icon}
        src="/icons/hamburger.svg"
        alt="Open Sidebar"
        priority
        width={24}
        height={24}
      />
    </button>
  );
}
