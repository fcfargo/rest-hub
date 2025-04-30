import PostList from './posts/list/postList';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Home() {
  return (
    <div className="flex justify-center items-center flex-grow">
      <ProtectedRoute>
        <PostList />
      </ProtectedRoute>
    </div>
  );
}
