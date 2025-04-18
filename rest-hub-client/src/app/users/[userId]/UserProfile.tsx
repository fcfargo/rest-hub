'use client';

import classNames from 'classnames';
import Image from 'next/image';

import { ErrorMessage } from '@/components/ui/message';
import { InfiniteScrollLoader } from '@/components/ui/ScrollBoundaryIndicators';
import { PROFILE_IMAGE_DEFAULT } from '@/constants';
import { useMounted } from '@/hooks/useMounted';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import { useUserProfile } from '@/hooks/useUserProfile';
import styles from '@/styles/user/userProfile.module.css';

interface UserProfileProps {
  userId: number;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const isMounted = useMounted();
  const currentUser = useProtectedUser();
  const isMyPage = currentUser.id === userId;

  const { user, loading, error } = useUserProfile(userId);

  if (!isMyPage) {
    if (loading) {
      return <InfiniteScrollLoader isLoading={loading} />;
    }
    if (error || !user) {
      const message = error ? error : '유저 정보를 불러오지 못했습니다.';
      return <ErrorMessage message={message} />;
    }
  }

  const profile = isMyPage ? currentUser : user!;
  const profileImage = currentUser.profileImage || PROFILE_IMAGE_DEFAULT;
  return (
    <div className={classNames(styles.container, isMounted ? styles.active : '')}>
      <div className={styles.profileWrapper}>
        <Image
          src={profileImage}
          alt="User Profile"
          width={60}
          height={60}
          priority
          className={classNames(
            styles.profileIcon,
            !currentUser.profileImage && styles.defaultProfileIcon,
          )}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.profileHeader}>
          <h2 className={styles.username}>{profile.username}</h2>

          {isMyPage && (
            <div className={styles.editButtonWrapper}>
              <button className={styles.editButton} onClick={() => console.log('프로필 편집')}>
                프로필 편집
              </button>
            </div>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>팔로워</span>
            <span className={styles.statCount}>{profile.followersCount}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>팔로잉</span>
            <span className={styles.statCount}>{profile.followingsCount}</span>
          </div>
        </div>

        <p className={styles.description}>{profile.description}</p>
      </div>
    </div>
  );
}
