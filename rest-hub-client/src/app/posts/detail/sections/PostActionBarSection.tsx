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
  const [currentLikesCount, setcurrentLikesCount] = useState(likesCount);
  const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);

  const { logout } = useAuth();
  const { posts, updatePost } = usePost();

  const handleLikeButtonClick = async () => {
    const requestFn = isLiked
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

      setCurrentIsLiked(!currentIsLiked);
      setcurrentLikesCount(likesCount);

      const targetPost = posts.find((post) => post.id === postId);
      if (targetPost) {
        updatePost({ ...targetPost, isLiked, likesCount });
      }
    } catch (error) {
      console.error('Like request failed:', error);
    }
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
        <span className={styles.likesCount}>{currentLikesCount}</span>
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
