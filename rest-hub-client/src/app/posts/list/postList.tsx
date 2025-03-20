'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import PostItem from './postItem';

import { ErrorMessage } from '@/components/ui/message';
import { useAuth } from '@/context/authContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/posts/postList.module.css';
import { Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestTotalPages, setLatestTotalPages] = useState<number | null>(null); // 최신 totalPages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isMounted = useMounted();
  const { logout } = useAuth();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (page: number) => {
    if (loading || (latestTotalPages !== null && page > latestTotalPages)) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.get(API_ENDPOINTS.POST_LIST, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page, limit: 10 },
        });
      }, logout);

      setPosts((prevPosts) => [...prevPosts, ...data.body.posts]);

      setLatestTotalPages(data.body.meta.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setMessage('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          latestTotalPages !== null &&
          currentPage < latestTotalPages
        ) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [currentPage, latestTotalPages]);

  return (
    <div className={classNames(styles.container, isMounted ? styles.active : '')}>
      {message && <ErrorMessage message={message} />}
      {!loading && !message && posts.map((post: Post) => <PostItem key={post.id} post={post} />)}
      {/* 로딩 UI */}
      <div ref={observerRef} className={styles.loadingIndicator}>
        {loading && (
          <Image
            className={styles.loadingIcon}
            src="/posts/loading.gif"
            alt="Location loading Icon"
            width={24}
            height={24}
            priority
          />
        )}
      </div>
      {/* 더 이상 데이터가 없을 때 표시되는 메시지 */}
      {latestTotalPages !== null && currentPage >= latestTotalPages && (
        <div className={styles.noMorePosts}>
          <p>더 이상 게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
