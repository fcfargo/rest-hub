'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { useModal } from '@/context/modalContext';
import styles from '@/styles/layout/hamburgerButton.module.css';

interface HamburgerButtonProps {
  onClick: Dispatch<SetStateAction<boolean>>;
}

export default function HamburgerButton({ onClick }: HamburgerButtonProps) {
  const { isModalOpen } = useModal();

  if (isModalOpen) {
    return null;
  }

  return (
    <button onClick={() => onClick((prev) => !prev)} className={styles.hamburgerButton}>
      <Image
        className={styles.icon}
        src="/icons/hamburger.svg"
        alt="Open Sidebar"
        width={24}
        height={24}
      />
    </button>
  );
}
