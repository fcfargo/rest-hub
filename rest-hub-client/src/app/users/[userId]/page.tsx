import React, { use } from 'react';

import UserPostList from './UserPostList';

import UserProfile from '@/app/users/[userId]/UserProfile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface UserPageProps {
  params: Promise<{ userId: number }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { userId } = use(params);

  return (
    <div className="h-screen flex flex-col flex-grow items-center ">
      <ProtectedRoute>
        <div className="flex-shrink-0 sticky top-0 z-5 w-[500px] border-b border-[#e0e2e9] px-4 py-2">
          <UserProfile userId={Number(userId)} />
        </div>
        <div className="flex-grow overflow-y-auto">
          <UserPostList userId={Number(userId)} />
        </div>
      </ProtectedRoute>
    </div>
  );
}
