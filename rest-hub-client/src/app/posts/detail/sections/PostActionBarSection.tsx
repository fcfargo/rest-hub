'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import styles from '@/styles/posts/postActionBar.module.css';

interface PostActionBarSectionProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export default function PostActionBarSection({
  likesCount,
  commentsCount,
  isLiked,
}: PostActionBarSectionProps) {
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);

  const handleLikeButtonClick = () => {
    // TODO: 좋아요 추가 or 취소 API 요청 처리

    setCurrentIsLiked((prev) => !prev);
  };
  return (
    <div className={styles.contianer}>
      {/* 좋아요 버튼 */}
      <button
        onClick={handleLikeButtonClick}
        className={classNames(styles.likesButton, currentIsLiked && styles.liked)}
        aria-label="Like post"
      >
        <Image src="/posts/heart.svg" alt="Likes" width={18} height={18} className={styles.icon} />
        <span className={styles.likesCount}>{likesCount}</span>
      </button>

      {/* 댓글 버튼 */}
      <button className={styles.commentsButton} aria-label="View comments">
        <Image
          src="/posts/message-square-text.svg"
          alt="Comments"
          width={18}
          height={18}
          className={styles.icon}
        />
        <span className={styles.commentsCount}>{commentsCount}</span>
      </button>
    </div>
  );
}
