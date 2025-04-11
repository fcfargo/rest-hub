'use client';

import classNames from 'classnames';
import Image from 'next/image';

import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentActionBar.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface CommentActionBarProps {
  commentId: string;
  postId: string;
  isLiked: boolean;
  likesCount: number;
  onUpdateCommentLikeStatus: (commentId: string, isLiked: boolean, likesCount: number) => void;
}

export default function CommentActionBar({
  commentId,
  postId,
  likesCount,
  isLiked,
  onUpdateCommentLikeStatus,
}: CommentActionBarProps) {
  const { logout } = useAuth();

  /** 좋아요 버튼 클릭 핸들러 */
  const handleLikeButtonClick = async () => {
    const requestFn = isLiked
      ? async (accessToken: string) => {
          return api.delete(`${API_ENDPOINTS.POST}/${postId}/comments/${commentId}/like`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }
      : async (accessToken: string) => {
          return api.post(
            `${API_ENDPOINTS.POST}/${postId}/comments/${commentId}/like`,
            {},
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
        };

    try {
      const { data } = await apiRequest(requestFn, logout);

      const newIsLiked = data.body.isLiked;
      const newLikesCount = data.body.likesCount;

      onUpdateCommentLikeStatus(commentId, newIsLiked, newLikesCount);
    } catch (error) {
      console.error('Like request failed:', error);
    }
  };

  return (
    <section className={styles.contianer} aria-label="Comment actions">
      {/* 좋아요 버튼 */}
      <button
        onClick={handleLikeButtonClick}
        className={classNames(styles.likesButton, isLiked && styles.liked)}
        aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
      >
        <Image
          src="/post/heart.svg"
          alt="Likes icon"
          width={14}
          height={14}
          className={styles.icon}
        />
      </button>

      <p className={styles.likesCount}>{likesCount}</p>
    </section>
  );
}
