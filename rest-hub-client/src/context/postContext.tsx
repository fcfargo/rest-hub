'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

import { Post } from '@/types';

interface PostContextValue {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
}

const PostContext = createContext<PostContextValue | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  /** 게시글 추가 */
  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  /** 게시글 업데이트 */
  const updatePost = (updatedPost: Post) => {
    setPosts((prevPosts) => prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  /** 게시글 삭제 */
  const deletePost = (deletedPostId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPostId));
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost, updatePost, deletePost }}>
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
