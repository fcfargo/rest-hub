'use client';

import classNames from 'classnames';
import { useState } from 'react';

import { CloseButtonWhite } from '../ui/closeButton';

import { ErrorMessage } from '@/components/ui/message';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/follow/unfollow.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface UnfollowModalProps {
  targetUserId: number;
}

export default function UnfollowModal({ targetUserId }: UnfollowModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { closeModal } = useModal();
  const { logout } = useAuth();
  const { patchPostsByAuthorId } = usePost();
  const isMounted = useMounted();

  /**
   * 언팔로우 요청 처리
   */
  const handleCommentDelete = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      await apiRequest(async (accessToken: string) => {
        return api.delete(`${API_ENDPOINTS.FOLLOW}`, {
          data: { followingId: targetUserId },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      patchPostsByAuthorId(targetUserId, { isFollowing: false });
      closeModal();
    } catch (err) {
      console.error('Unfollow user failed:', err);
      setMessage('언팔로우 처리 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />

      <div className={styles.container}>
        <div className={classNames(styles.wrapper, isMounted && styles.active)}>
          <h2 className={styles.title}>언팔로우 하시겠어요?</h2>
          <p className={styles.description}>상대방 피드가 더 이상 나타나지 않습니다.</p>

          <div className={styles.actions}>
            <button
              className={styles.deleteButton}
              onClick={handleCommentDelete}
              disabled={isLoading}
            >
              언팔로우
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
