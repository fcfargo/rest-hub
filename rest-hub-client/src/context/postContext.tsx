'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

import { Post } from '@/types';

interface PostContextValue {
  posts: Post[];
  setPosts: Dispatch<SetStateAction<Post[]>>;
  addPost: (post: Post) => void;
}

const PostContext = createContext<PostContextValue | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost }}>{children}</PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within PostProvider');
  }
  return context;
};
