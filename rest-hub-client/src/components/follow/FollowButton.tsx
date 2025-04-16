import Image from 'next/image';
import { useState } from 'react';

import { useAuth } from '@/context/authContext';
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
  const { patchPostsByAuthorId } = usePost();

  if (currentUserId === targetUserId) {
    return null;
  }

  const handleToggleFollow = async () => {
    setIsLoading(true);

    const requestFn = isFollowing
      ? async (accessToken: string) => {
          return api.delete(`${API_ENDPOINTS.FOLLOW}`, {
            data: { followingId: targetUserId },
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        }
      : async (accessToken: string) => {
          return api.post(
            `${API_ENDPOINTS.FOLLOW}`,
            { followingId: targetUserId },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
        };

    try {
      await apiRequest(requestFn, logout);
      patchPostsByAuthorId(targetUserId, { isFollowing: !isFollowing });
    } catch (error) {
      console.error('Follow toggle failed:', error);
    } finally {
      setIsLoading(false);
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
