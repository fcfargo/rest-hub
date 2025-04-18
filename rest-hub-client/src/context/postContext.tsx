'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

import { Post } from '@/types';

interface PostContextValue {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  addPost: (post: Post) => void;
  patchPost: (postId: string, partial: Partial<Post>) => void;
  patchPostsByAuthorId: (authorId: number, partial: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  updatePostCommentsCount: (postId: string, newCount: number) => void;
}

const PostContext = createContext<PostContextValue | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  /** 게시글 추가 */
  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  /** 게시글 부분 업데이트 */
  const patchPost = (postId: string, partial: Partial<Post>) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...partial } : p)));
  };

  /** 작성자 전체 게시글 부분 업데이트 */
  const patchPostsByAuthorId = (authorId: number, partial: Partial<Post>) => {
    setPosts((prev) => prev.map((p) => (p.user.id === authorId ? { ...p, ...partial } : p)));
  };

  /** 게시글 삭제 */
  const deletePost = (deletedPostId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPostId));
  };

  /** 게시글 댓글 수 업데이트 */
  const updatePostCommentsCount = (postId: string, newCount: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === postId ? { ...p, commentsCount: newCount } : p)),
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        addPost,
        patchPost,
        patchPostsByAuthorId,
        deletePost,
        updatePostCommentsCount,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
};
