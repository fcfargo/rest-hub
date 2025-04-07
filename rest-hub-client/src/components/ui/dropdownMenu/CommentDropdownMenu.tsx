'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { COMMENT_MENU_ITEM_TYPES } from '@/constants';
import styles from '@/styles/utils/dropdownMenu/commonDropdownMenu.module.css';

interface DropdownMenuProps {
  userId: number;
  writerId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelectMenuItem: (value: number) => void;
}

const COMMENT_MENU_ITEMS = [
  { label: '삭제하기', value: COMMENT_MENU_ITEM_TYPES.DELETE },
  { label: '수정하기', value: COMMENT_MENU_ITEM_TYPES.UPDATE },
  { label: '신고하기', value: COMMENT_MENU_ITEM_TYPES.REPORT },
];

export default function CommentDropdownMenu({
  userId,
  writerId,
  open,
  setOpen,
  onSelectMenuItem,
}: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // 사용자 권한에 따른 메뉴 필터링
  const getFilteredCommentMenuItems = (userId: number, writerId: number) => {
    const isOwner = userId === writerId;
    return COMMENT_MENU_ITEMS.filter(({ value }) => {
      if (isOwner) {
        return value !== COMMENT_MENU_ITEM_TYPES.REPORT;
      } else {
        return value !== COMMENT_MENU_ITEM_TYPES.UPDATE && value !== COMMENT_MENU_ITEM_TYPES.DELETE;
      }
    });
  };

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
        aria-label="Comment menu"
        aria-expanded={open}
      >
        <Image
          src="/comment/menu.svg"
          alt="More"
          width={16}
          height={16}
          className={styles.moreButtonIcon}
        />
        {open && (
          <ul
            ref={dropdownRef}
            className={styles.dropdownMenu}
            role="menu"
            aria-label="Comment action menu"
          >
            {getFilteredCommentMenuItems(userId, writerId).map((item) => (
              <li
                key={item.value}
                className={styles.dropdownItem}
                role="menuItem"
                onClick={() => onSelectMenuItem(item.value)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </button>
    </div>
  );
}
