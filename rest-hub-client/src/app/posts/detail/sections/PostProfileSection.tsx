'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { PROFILE_IMAGE_DEFAULT, POST_MENU_ITEM_TYPES, MODAL_TYPES } from '@/constants';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import styles from '@/styles/posts/postProfile.module.css';
import { User, Post } from '@/types';
import { formatTimeAgo, getFormattedLocation } from '@/utils/format';

interface PostProfileSectionProps {
  post: Post;
}

const POST_MENU_ITEMS = [
  { label: '삭제하기', value: POST_MENU_ITEM_TYPES.DELETE },
  { label: '수정하기', value: POST_MENU_ITEM_TYPES.UPDATE },
  { label: '신고하기', value: POST_MENU_ITEM_TYPES.REPORT },
  { label: '숨기기', value: POST_MENU_ITEM_TYPES.HIDE },
];

export default function PostProfileSection({ post }: PostProfileSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropDownRef = useRef<HTMLUListElement>(null);

  const { openModal } = useModal();
  const { updatePost, deletePost } = usePost();
  const user = useProtectedUser();

  const { user: writer, createdAt, location } = post;
  const fromNow = formatTimeAgo(createdAt);
  const formattedLocation = location ? getFormattedLocation(location) : null;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운 클릭 핸들링
  const handlePostMenuItem = (value: number) => {
    if (value === POST_MENU_ITEM_TYPES.UPDATE) {
      openModal(MODAL_TYPES.POST_UPDATE, { post, onPostUpdated: updatePost });
      return;
    }

    if (value === POST_MENU_ITEM_TYPES.DELETE) {
      openModal(MODAL_TYPES.POST_DELETE, { postId: post.id, onPostDeleted: deletePost });
      return;
    }
  };

  const getFilteredPostMenuItems = (user: User, writer: Partial<User>) => {
    const isOwner = user.id === writer.id;
    return POST_MENU_ITEMS.filter((item) => {
      if (
        isOwner &&
        (item.value === POST_MENU_ITEM_TYPES.REPORT || item.value === POST_MENU_ITEM_TYPES.HIDE)
      )
        return false;
      if (
        !isOwner &&
        (item.value === POST_MENU_ITEM_TYPES.UPDATE || item.value === POST_MENU_ITEM_TYPES.DELETE)
      )
        return false;
      return true;
    });
  };

  return (
    <div className={styles.profile}>
      <div className={styles.userInfo}>
        <Image
          src={writer.profileImage || PROFILE_IMAGE_DEFAULT}
          alt="User Profile"
          width={40}
          height={40}
          className={styles.profileIcon}
        />
        <div className={styles.userDetails}>
          <div className={styles.userHeader}>
            <div className={styles.username}>{writer.username}</div>
            <button className={styles.follow}>팔로우</button>
          </div>
          <div className={styles.userFooter}>
            <div className={styles.timaAgo}>{fromNow}</div>
            {formattedLocation && (
              <>
                <div className={styles.separator}>•</div>
                <div className={styles.location}>{formattedLocation}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <button className={styles.moreButton} onClick={() => setIsDropdownOpen((prev) => !prev)}>
        <Image
          src="/posts/ellipsis.svg"
          alt="More"
          width={24}
          height={24}
          className={styles.moreButtonIcon}
        />
        {isDropdownOpen && (
          <ul ref={dropDownRef} className={styles.dropdownMenu}>
            {getFilteredPostMenuItems(user, writer).map((item) => (
              <li
                key={item.value}
                className={styles.dropdownItem}
                onClick={() => handlePostMenuItem(item.value)}
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
