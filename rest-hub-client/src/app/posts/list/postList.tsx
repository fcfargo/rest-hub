'use client';

import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import PostItem from './postItem';

import { ErrorMessage } from '@/components/ui/message';
import {
  EndOfContentMessage,
  InfiniteScrollLoader,
} from '@/components/ui/ScrollBoundaryIndicators';
import { SCROLLTO_BEHAVIOR } from '@/constants';
import { useAuth } from '@/context/authContext';
import { usePost } from '@/context/postContext';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/post/postList.module.css';
import { Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { mergeUniqueById } from '@/utils/array';

export default function PostList() {
  const [isPriorityPhase, setIsPriorityPhase] = useState(true);
  const [priorityPage, setPriorityPage] = useState(1);
  const [fallbackPage, setFallbackPage] = useState(1);
  const [priorityTotalPages, setPriorityTotalPages] = useState<number | null>(null);
  const [fallbackTotalPages, setFallbackTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [phaseMessage, setPhaseMessage] = useState<string | null>(null);

  const { posts, setPosts } = usePost();
  const isMounted = useMounted();
  const { logout } = useAuth();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef(0);
  const isFetchingRef = useRef(false);

  // ✅ hasMore: 현재 phase의 다음 페이지가 존재하는지를 나타냄
  // - 우선 피드 phase일 땐: priorityPage < priorityTotalPages
  // - fallback phase일 땐: fallbackPage < fallbackTotalPages
  // - totalPages가 null이면 아직 로딩 전이므로 true
  const isPriorityHasMore = priorityTotalPages === null || priorityPage < priorityTotalPages;
  const isFallbackHasMore = fallbackTotalPages === null || fallbackPage < fallbackTotalPages;

  const hasMore = isPriorityPhase ? isPriorityHasMore : isFallbackHasMore;
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
    if (loading || isFetchingRef.current) {
      return;
    }

    saveScrollPosition();
    setLoading(true);
    isFetchingRef.current = true;

    try {
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.get(API_ENDPOINTS.POST, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            page,
            limit: 10,
            isPriorityPhase,
          },
        });
      }, logout);

      const { posts: newPosts, meta } = data.body;
      setPosts((prevPosts) => mergeUniqueById<Post>(prevPosts, newPosts));

      if (isPriorityPhase && priorityPage >= meta.totalPages) {
        setPriorityTotalPages(meta.totalPages);
      } else {
        setFallbackTotalPages(meta.totalPages);
      }
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

    const page = isPriorityPhase ? priorityPage : fallbackPage;
    fetchPosts(page);
  }, [priorityPage, fallbackPage, isPriorityPhase]);

  /** 스크롤링 시 페이지의 마지막 게시물 감지 (Intersection Observer 등록) */
  useEffect(() => {
    if (!observerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || isFetchingRef.current) {
          return;
        }

        if (isPriorityPhase) {
          if (priorityTotalPages !== null && priorityPage < priorityTotalPages) {
            setPriorityPage((prevPage) => prevPage + 1);
          } else {
            setIsPriorityPhase(false);
            setPhaseMessage('우선 피드를 모두 확인했어요. 전체 피드로 전환합니다.');
          }
        } else {
          if (fallbackTotalPages !== null && fallbackPage < fallbackTotalPages) {
            setFallbackPage((prevPage) => prevPage + 1);
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [isPriorityPhase, priorityPage, fallbackPage, priorityTotalPages, fallbackTotalPages]);

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

  /** phase 전환 메시지 제거 */
  useEffect(() => {
    if (!phaseMessage) return;

    const timer = setTimeout(() => setPhaseMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [phaseMessage]);

  return (
    <div ref={scrollContainerRef} className={styles.scrollContainer}>
      <div className={classNames(styles.container, isMounted ? styles.active : '')}>
        {phaseMessage && <div className={styles.phaseTag}>{phaseMessage}</div>}
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
