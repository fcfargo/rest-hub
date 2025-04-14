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

interface CommentReplyDeleteModalProps {
  postId: string;
  parentId: string;
  replyId: string;
  deleteCommentReply: (replyId: string) => void;
  updateCommentRepliesCount: (commentId: string, repliesCount: number) => void;
}

export default function CommentReplyDeleteModal({
  postId,
  parentId,
  replyId,
  deleteCommentReply,
  updateCommentRepliesCount,
}: CommentReplyDeleteModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { closeModal } = useModal();
  const { logout } = useAuth();
  const isMounted = useMounted();

  /**
   * 답글 삭제 요청 처리
   */
  const handleCommenReplyDelete = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.delete(
          `${API_ENDPOINTS.POST}/${postId}/comments/${parentId}/replies/${replyId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      }, logout);

      const { parentRepliesCount } = data.body;

      closeModal();
      deleteCommentReply(replyId);
      updateCommentRepliesCount(parentId, parentRepliesCount);
    } catch (err) {
      console.error('Failed to delete reply:', err);
      setMessage('답글 삭제 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={classNames(styles.wrapper, isMounted && styles.active)}>
          <h2 className={styles.title}>답글을 삭제할까요?</h2>
          <p className={styles.description}>삭제된 답글은 복구할 수 없습니다.</p>
          <div className={styles.actions}>
            <button
              className={styles.deleteButton}
              onClick={handleCommenReplyDelete}
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
