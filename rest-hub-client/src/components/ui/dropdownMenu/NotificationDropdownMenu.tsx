'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { NOTIFICATION_MENU_ITEM_TYPES } from '@/constants';
import styles from '@/styles/utils/dropdownMenu/notificationDropdownMenu.module.css';

interface DropdownMenuProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelectMenuItem: (value: number) => void;
}

const NOTIFICATION_MENU_ITEMS = [{ label: '삭제하기', value: NOTIFICATION_MENU_ITEM_TYPES.DELETE }];

export default function NotificationDropdownMenu({
  open,
  setOpen,
  onSelectMenuItem,
}: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={styles.moreButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notification menu"
        aria-expanded={open}
      >
        <Image
          src="/comment/menu.svg"
          alt="More"
          width={16}
          height={16}
          className={styles.moreButtonIcon}
        />
      </button>

      {open && (
        <ul
          ref={dropdownRef}
          className={styles.dropdownMenu}
          role="menu"
          aria-label="Notification action menu"
        >
          {NOTIFICATION_MENU_ITEMS.map((item) => (
            <li
              key={item.value}
              className={styles.dropdownItem}
              role="menuItem"
              onClick={() => {
                setOpen(false);
                onSelectMenuItem(item.value);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
