'use client';

import classNames from 'classnames';
import Image from 'next/image';

import { MODAL_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/post/postActionBar.module.css';
import { Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

interface PostActionBarSectionProps {
  post: Post;
}

export default function PostActionBarSection({ post }: PostActionBarSectionProps) {
  const { id, commentsCount, isLiked, likesCount } = post;

  const { openModal } = useModal();
  const { logout } = useAuth();
  const { posts, updatePost } = usePost();

  /** 좋아요 버튼 클릭 핸들러 */
  const handleLikeButtonClick = async () => {
    const requestFn = isLiked
      ? async (accessToken: string) => {
          return api.delete(`${API_ENDPOINTS.POST}/${id}/like`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }
      : async (accessToken: string) => {
          return api.post(
            `${API_ENDPOINTS.POST}/${id}/like`,
            {},
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
        };

    try {
      const { data } = await apiRequest(requestFn, logout);
      const { isLiked, likesCount } = data.body;

      // 전역 상태(PostContext) 업데이트
      const targetPost = posts.find((post) => post.id === id);
      if (targetPost) {
        updatePost({ ...targetPost, isLiked, likesCount });
      }
    } catch (error) {
      console.error('Like request failed:', error);
    }
  };

  /** 댓글 버튼 클릭 핸들러 */
  const handleCommentButtonClick = async () => {
    openModal(MODAL_TYPES.POST_DETAIL, { postId: id });
    return;
  };

  return (
    <section className={styles.contianer} aria-label="Post actions">
      {/* 좋아요 버튼 */}
      <button
        onClick={handleLikeButtonClick}
        className={classNames(styles.likesButton, isLiked && styles.liked)}
        aria-label={isLiked ? 'Unlike post' : 'Like post'}
      >
        <Image
          src="/post/heart.svg"
          alt="Likes icon"
          width={18}
          height={18}
          className={styles.icon}
        />
        <span className={styles.likesCount}>{likesCount}</span>
      </button>

      {/* 댓글 버튼 */}
      <button
        onClick={handleCommentButtonClick}
        className={styles.commentsButton}
        aria-label="View comments"
      >
        <Image
          src="/post/message-square-text.svg"
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
