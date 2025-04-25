'use client';

import { useEffect, useRef, useState } from 'react';

import CommentInput from './CommentInput';
import CommentList from './CommentList';
import PostActionBarSection from '../sections/PostActionBarSection';

import { SCROLLTO_BEHAVIOR } from '@/constants';
import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentSection.module.css';
import { Comment, Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { mergeUniqueById } from '@/utils/array';

interface CommentSectionProps {
  post: Post;
  children: React.ReactNode;
}

export default function CommentSection({ post, children }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestTotalPages, setLatestTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { logout } = useAuth();

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef(0);
  const isFetchingRef = useRef(false);

  const hasMore = !!latestTotalPages && currentPage < latestTotalPages;

  const { id } = post;

  /** 댓글 추가 */
  const handleAddComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

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

      // 다음 fetchComments 실행을 허용
      isFetchingRef.current = false;
    });
  };

  /** 댓글 가져오기 */
  const fetchComments = async (page: number) => {
    if (isLoading || isFetchingRef.current) {
      return;
    }

    saveScrollPosition();
    setIsLoading(true);
    isFetchingRef.current = true;

    try {
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.get(`${API_ENDPOINTS.POST}/${id}/comments`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page, limit: 10 },
        });
      }, logout);

      setComments((prevComments) => mergeUniqueById<Comment>(prevComments, data.body.comments));

      setLatestTotalPages(data.body.meta.totalPages);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setMessage('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      restoreScrollPosition();
    }
  };

  /** 게시글 변경 시 댓글 가져오기  */
  useEffect(() => {
    // 중복 요청 방지: fetchComments가 이미 실행 중인 경우
    if (isFetchingRef.current) {
      return;
    }

    fetchComments(currentPage);
  }, [id, currentPage]);

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

  return (
    <div className={styles.container}>
      {/* 스크롤이 발생하는 영역 */}
      <div className={styles.scrollArea}>
        {children}

        <CommentList
          comments={comments}
          onChangeComments={setComments}
          isLoading={isLoading}
          hasMore={hasMore}
          errorMessage={message}
          observerRef={observerRef}
          scrollContainerRef={scrollContainerRef}
        />
      </div>

      {/* 게시글 액션 바 && 댓글 입력 창 */}
      <div className={styles.footerBar}>
        <div className={styles.postActionBarContainer}>
          <PostActionBarSection post={post} />
        </div>

        <div className={styles.commentInputContainer}>
          <CommentInput postId={id} onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
