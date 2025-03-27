'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { PostMediaViewer } from '@/components/media/mediaPreview';
import { MEDIA_TYPES, MODAL_TYPES, POST_MENU_ITEM_TYPES, PROFILE_IMAGE_DEFAULT } from '@/constants';
import { useModal } from '@/context/modalContext';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import styles from '@/styles/posts/postItem.module.css';
import { Post, User } from '@/types';
import { formatTimeAgo, getFormattedLocation } from '@/utils/format';

interface PostItemProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
  onPostDeleted: (deletedPostId: string) => void;
}

const POST_MENU_ITEMS = [
  { label: '삭제하기', value: POST_MENU_ITEM_TYPES.DELETE },
  { label: '수정하기', value: POST_MENU_ITEM_TYPES.UPDATE },
  { label: '신고하기', value: POST_MENU_ITEM_TYPES.REPORT },
  { label: '숨기기', value: POST_MENU_ITEM_TYPES.HIDE },
];

export default function PostItem({ post, onPostUpdated, onPostDeleted }: PostItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropDownRef = useRef<HTMLUListElement>(null);

  const { openModal } = useModal();

  const user = useProtectedUser();

  const { createdAt, location, user: writer, content, imageUrl, likesCount } = post;

  const fromNow = formatTimeAgo(createdAt);
  const formattedLocation = location ? getFormattedLocation(location) : null;

  /** 외부 클릭 감지하여 드롭다운 메뉴 닫기 */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** 드롭다운 메뉴 클릭 처리 */
  const handlePostMenuItem = async (value: number) => {
    if (value === POST_MENU_ITEM_TYPES.UPDATE) {
      openModal(MODAL_TYPES.POST_UPDATE, { post, onPostUpdated });
      return;
    }

    if (value === POST_MENU_ITEM_TYPES.DELETE) {
      openModal(MODAL_TYPES.POST_DELETE, { postId: post.id, onPostDeleted });
      return;
    }
  };

  /** 이미지 클릭 처리 */
  const handleOpenImageModal = async () => {
    openModal(MODAL_TYPES.POST_DETAIL, { post });
    return;
  };

  /** 드롭다운 메뉴 아이템 필터링 */
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 프로필 영역 */}
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
            {/* 드롭다운 메뉴 */}
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

        {/* 게시글 텍스트 내용 */}
        <p className={styles.content}>{content}</p>

        {/* 게시글 이미지(여러 장 처리 로직은 추후 추가 예정 */}
        {imageUrl?.trim() && (
          <button type="button" onClick={handleOpenImageModal} className={styles.imageButton}>
            {/* 후속 작업
             * 1) 이미지 어려 개 업로드
             * 2) .gif 파일 업로드
             * 3) 비디오 파일 업로드
             * 현재는 이미지 파일만 처리하기 때문에, mediaType을 고정값으로 넘겨주고 있지만
             * 나중에 mediaType 정보를 DB에서 받아서 넘겨주도록 수정 예정
             */}
            <PostMediaViewer url={imageUrl} className="rounded-lg" mediaType={MEDIA_TYPES.IMAGE} />
          </button>
        )}

        {/* 하단 좋아요 및 댓글 영역 */}
        <div className={styles.footer}>
          {/* 좋아요 버튼 */}
          <button className={styles.likesButton} aria-label="Like post">
            <Image
              src="/posts/heart.svg"
              alt="Likes"
              width={20}
              height={20}
              className={styles.footerIcon}
            />
            <span className={styles.likesCount}>{likesCount}</span>
          </button>

          {/* 댓글 버튼 */}
          <button className={styles.commentsButton} aria-label="View comments">
            <Image
              src="/posts/message-square-text.svg"
              alt="Comments"
              width={20}
              height={20}
              className={styles.fotterIcon}
            />
            <span className={styles.commentsCount}>0</span>
          </button>
        </div>
      </div>
    </div>
  );
}
