'use client';

import styles from '@/styles/posts/postList.module.css';
import { Post } from '@/types';

interface PostItemProps {
  key: number;
  post: Post;
}

export default function PostItem({ key, post }: PostItemProps) {
  return <div className={styles.container}></div>;
}
