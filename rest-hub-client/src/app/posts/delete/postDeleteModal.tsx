'use client';

import classNames from 'classnames';
import { useState } from 'react';

import { CloseButtonWhite } from '@/components/ui/closeButton';
import { ErrorMessage } from '@/components/ui/message';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/posts/postDelete.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface PostDeleteModalProps {
  postId: string;
  onPostDeleted: (deletedPostId: string) => void;
}

export default function PostDeleteModal({ postId, onPostDeleted }: PostDeleteModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { closeModal } = useModal();
  const { logout } = useAuth();
  const isMounted = useMounted();

  /**
   * 게시글 삭제 요청 처리
   */
  const handlePostDelete = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      await apiRequest(async (accessToken: string) => {
        return api.delete(`${API_ENDPOINTS.POST}/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      closeModal();
      onPostDeleted(postId);
    } catch (err) {
      console.error('Failed to delete post:', err);
      setMessage('게시글 삭제 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />

      <div className={styles.container}>
        <div className={classNames(styles.wrapper, isMounted && styles.active)}>
          <h2 className={styles.title}>게시물을 삭제할까요?</h2>
          <p className={styles.description}>삭제된 게시물은 복구할 수 없습니다.</p>
          <div className={styles.actions}>
            <button className={styles.deleteButton} onClick={handlePostDelete} disabled={isLoading}>
              삭제하기
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => closeModal()}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
          {message && <ErrorMessage message={message} className="mb-[8px]" />}
        </div>
      </div>
    </div>
  );
}
