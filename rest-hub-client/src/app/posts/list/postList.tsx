'use client';

import classNames from 'classnames';
import { useState } from 'react';

import PostItem from './postItem';

import { useMounted } from '@/hooks/useMounted';
import styles from '@/styles/posts/postList.module.css';
import { Post } from '@/types';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  const isMounted = useMounted();
  return (
    <div className={classNames(styles.container, isMounted ? styles.active : '')}>
      {posts.map((post: Post) => (
        <PostItem key={post.id} post={post} />
      ))}
      {/* <div ref={ref} className={styles.loadingIndicator}>
        {loading && 'Loading more posts...'}
      </div> */}
    </div>
  );
}
