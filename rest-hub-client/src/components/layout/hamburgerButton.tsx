'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useModal } from '@/context/modalContext';
import { useSidebar } from '@/context/sidebarContext';
import styles from '@/styles/layout/hamburgerButton.module.css';

const rightAlignedPaths = ['/users'];

function shouldMoveRight(pathname: string) {
  return rightAlignedPaths.some((prefix) => pathname.startsWith(prefix));
}

export default function HamburgerButton() {
  const { isModalOpen } = useModal();
  const { setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();

  if (isModalOpen || !pathname) {
    return null;
  }

  const buttonClass = `${styles.hamburgerButton} ${
    shouldMoveRight(pathname) ? styles.rightPosition : ''
  }`;

  return (
    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className={buttonClass}>
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
