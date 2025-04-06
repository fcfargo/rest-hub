'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import PostItem from './postItem';

import { ErrorMessage } from '@/components/ui/message';
import { SCROLLTO_BEHAVIOR } from '@/constants';
import { useAuth } from '@/context/authContext';
import { usePost } from '@/context/postContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/posts/postList.module.css';
import { Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { mergeUniqueById } from '@/utils/array';
import {
  EndOfContentMessage,
  InfiniteScrollLoader,
} from '@/components/ui/ScrollBoundaryIndicators';

export default function PostList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [latestTotalPages, setLatestTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { posts, setPosts } = usePost();
  const isMounted = useMounted();
  const { logout } = useAuth();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef(0);
  const isFetchingRef = useRef(false);

  const hasMore = !!latestTotalPages && currentPage < latestTotalPages;

  /** 현재 스크롤 위치 저장 */
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  };

  /**
   * 저장된 스크롤 위치로 복원
   * DOM 렌더링이 완료된 다음 프레임에 scrollTo를 실행하여
   * 스크롤 초기화 현상을 방지
   * */
  const restoreScrollPosition = () => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollPositionRef.current,
          behavior: SCROLLTO_BEHAVIOR.INSTANT,
        });
      }

      // 다음 fetchPosts 실행을 허용
      isFetchingRef.current = false;
    });
  };

  /** 게시글 리스트 API로부터 가져오기 */
  const fetchPosts = async (page: number) => {
    if (loading || (latestTotalPages !== null && page > latestTotalPages)) {
      return;
    }

    saveScrollPosition();
    setLoading(true);
    isFetchingRef.current = true;

    try {
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.get(API_ENDPOINTS.POST, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page, limit: 10 },
        });
      }, logout);

      setPosts((prevPosts) => mergeUniqueById<Post>(prevPosts, data.body.posts));

      setLatestTotalPages(data.body.meta.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setMessage('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      restoreScrollPosition();
    }
  };

  /** 페이지 변경 시 게시글 가져오기  */
  useEffect(() => {
    // 중복 요청 방지: fetchPosts가 이미 실행 중인 경우
    if (isFetchingRef.current) {
      return;
    }

    fetchPosts(currentPage);
  }, [currentPage]);

  /** 스크롤링 시 페이지의 마지막 게시물 감지 (Intersection Observer 등록) */
  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          latestTotalPages !== null &&
          currentPage < latestTotalPages &&
          !isFetchingRef.current
        ) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [currentPage, latestTotalPages]);

  /** 스크롤 이벤트 리스너 등록 (스크롤 위치 저장) */
  useEffect(() => {
    const handleScroll = () => {
      if (!isFetchingRef.current && scrollContainerRef.current) {
        scrollPositionRef.current = scrollContainerRef.current.scrollTop;
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className={styles.scrollContainer}>
      <div className={classNames(styles.container, isMounted ? styles.active : '')}>
        {message && <ErrorMessage message={message} />}

        {posts.length === 0 && !loading && !message && (
          <div className={styles.empty}>아직 게시글이 없습니다.</div>
        )}

        {!loading && !message && posts.map((post: Post) => <PostItem key={post.id} post={post} />)}

        <InfiniteScrollLoader isLoading={loading} observerRef={observerRef} />

        {!hasMore && posts.length > 0 && (
          <EndOfContentMessage message="더 이상 게시글이 없습니다." />
        )}
      </div>
    </div>
  );
}
