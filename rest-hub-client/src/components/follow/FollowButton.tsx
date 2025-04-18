import Image from 'next/image';
import { useState } from 'react';

import { MODAL_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/follow/followButton.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface FollowButtonProps {
  currentUserId: number;
  targetUserId: number;
  isFollowing: boolean;
}

export default function FollowButton({
  currentUserId,
  targetUserId,
  isFollowing,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const { openModal } = useModal();
  const { patchPostsByAuthorId } = usePost();

  if (currentUserId === targetUserId) {
    return null;
  }

  const followUser = async () => {
    setIsLoading(true);
    try {
      await apiRequest(async (accessToken: string) => {
        return api.post(
          `${API_ENDPOINTS.FOLLOW}`,
          { followingId: targetUserId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      }, logout);
      patchPostsByAuthorId(targetUserId, { isFollowing: true });
    } catch (error) {
      console.error('Follow user failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (isFollowing) {
      openModal(MODAL_TYPES.UNFOLLOW_USER, {
        targetUserId,
      });
    } else {
      followUser();
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleToggleFollow} disabled={isLoading} className={styles.follow}>
        {isFollowing ? (
          <Image
            className={styles.followingIcon}
            src="/follow/follow.svg"
            alt="Following User"
            width={16}
            height={16}
          />
        ) : (
          '팔로우'
        )}
      </button>
    </div>
  );
}
