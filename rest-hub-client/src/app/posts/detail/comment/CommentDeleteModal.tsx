'use client';

import classNames from 'classnames';
import { useState } from 'react';

import { ErrorMessage } from '@/components/ui/message';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentDelete.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface CommentDeleteModalProps {
  postId: string;
  commentId: string;
  deleteComment: (commentId: string) => void;
}

export default function CommentDeleteModal({
  postId,
  commentId,
  deleteComment,
}: CommentDeleteModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { closeModal } = useModal();
  const { logout } = useAuth();
  const isMounted = useMounted();

  /**
   * 댓글 삭제 요청 처리
   */
  const handleCommentDelete = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      await apiRequest(async (accessToken: string) => {
        return api.delete(`${API_ENDPOINTS.POST}/${postId}/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      closeModal();
      deleteComment(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setMessage('댓글 삭제 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={classNames(styles.wrapper, isMounted && styles.active)}>
          <h2 className={styles.title}>댓글을 삭제할까요?</h2>
          <p className={styles.description}>삭제된 댓글은 복구할 수 없습니다.</p>
          <div className={styles.actions}>
            <button
              className={styles.deleteButton}
              onClick={handleCommentDelete}
              disabled={isLoading}
            >
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
          {message && <ErrorMessage message={message} className="!text-[12px] mt-[-8px]" />}
        </div>
      </div>
    </div>
  );
}
