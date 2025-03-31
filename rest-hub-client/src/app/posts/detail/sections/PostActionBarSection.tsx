'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import { useAuth } from '@/context/authContext';
import { usePost } from '@/context/postContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/posts/postActionBar.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface PostActionBarSectionProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export default function PostActionBarSection({
  postId,
  likesCount,
  commentsCount,
  isLiked,
}: PostActionBarSectionProps) {
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);

  const { logout } = useAuth();
  const { posts, updatePost } = usePost();

  /** 좋아요 버튼 클릭 핸들러 */
  const handleLikeButtonClick = async () => {
    const requestFn = currentIsLiked
      ? async (accessToken: string) => {
          return api.delete(`${API_ENDPOINTS.POST}/${postId}/like`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }
      : async (accessToken: string) => {
          return api.post(
            `${API_ENDPOINTS.POST}/${postId}/like`,
            {},
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
        };

    try {
      const { data } = await apiRequest(requestFn, logout);
      const { isLiked, likesCount } = data.body;

      // 로컬 상태 업데이트
      setCurrentIsLiked(!currentIsLiked);
      setCurrentLikesCount(likesCount);

      // 전역 상태(PostContext) 업데이트
      const targetPost = posts.find((post) => post.id === postId);
      if (targetPost) {
        updatePost({ ...targetPost, isLiked, likesCount });
      }
    } catch (error) {
      console.error('Like request failed:', error);
    }
  };

  return (
    <section className={styles.contianer} aria-label="Post actions">
      {/* 좋아요 버튼 */}
      <button
        onClick={handleLikeButtonClick}
        className={classNames(styles.likesButton, currentIsLiked && styles.liked)}
        aria-label={currentIsLiked ? 'Unlike post' : 'Like post'}
      >
        <Image
          src="/posts/heart.svg"
          alt="Likes icon"
          width={18}
          height={18}
          className={styles.icon}
        />
        <span className={styles.likesCount}>{currentLikesCount}</span>
      </button>

      {/* 댓글 버튼 */}
      <button className={styles.commentsButton} aria-label="View comments">
        <Image
          src="/posts/message-square-text.svg"
          alt="Comments icon"
          width={18}
          height={18}
          className={styles.icon}
        />
        <span className={styles.commentsCount}>{commentsCount}</span>
      </button>
    </section>
  );
}
