import React, { use } from 'react';

import UserPostList from './UserPostList';

import UserProfile from '@/app/users/[userId]/UserProfile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import styles from '@/styles/user/userPage.module.css';

interface UserPageProps {
  params: Promise<{ userId: number }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { userId } = use(params);

  return (
    <div className={styles.userPage}>
      <ProtectedRoute>
        <div className={styles.userProfileWrapper}>
          <UserProfile userId={Number(userId)} />
        </div>
        <div className={styles.userPostListWrapper}>
          <UserPostList />
        </div>
      </ProtectedRoute>
    </div>
  );
}
