'use client';

import PostList from './posts/list/postList';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouteEffect } from '@/hooks/useRouteEffect';

export default function Home() {
  useRouteEffect();

  return (
    <div className="flex justify-center items-center flex-grow">
      <ProtectedRoute>
        <PostList />
      </ProtectedRoute>
    </div>
  );
}
