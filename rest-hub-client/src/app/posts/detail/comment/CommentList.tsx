'use client';

import { Dispatch, SetStateAction } from 'react';

import CommentItem from './CommentItem';

import { ErrorMessage } from '@/components/ui/message';
import {
  EndOfContentMessage,
  InfiniteScrollLoader,
} from '@/components/ui/ScrollBoundaryIndicators';
import styles from '@/styles/comment/commentList.module.css';
import { Comment } from '@/types';

interface CommentListProps {
  comments: Comment[];
  onChangeComments: Dispatch<SetStateAction<Comment[]>>;
  isLoading: boolean;
  hasMore: boolean;
  errorMessage: string | null;
  observerRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function CommentList({
  comments,
  onChangeComments,
  isLoading,
  hasMore,
  errorMessage,
  observerRef,
  scrollContainerRef,
}: CommentListProps) {
  /** 댓글 수정 핸들러 */
  const handleUpdateComment = (updated: Comment) => {
    onChangeComments((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
  };

  /** 댓글 삭제 핸들러 */
  const handleDeleteComment = (commentId: string) => {
    onChangeComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  /** 대댓글 추가 핸들러 (추후 구현 예정) */
  const handleAddReply = (parentId: string, reply: Comment) => {};

  /** 대댓글 수정 핸들러 (추후 구현 예정) */
  const handleUpdateReply = (parentId: string, reply: Comment) => {};

  /** 대댓글 삭제 핸들러 (추후 구현 예정) */
  const handleDeleteReply = (parentId: string, reply: Comment) => {};

  return (
    <div ref={scrollContainerRef} className={styles.container}>
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {comments.length === 0 && !isLoading && !errorMessage && (
        <div className={styles.empty}>아직 댓글이 없습니다.</div>
      )}

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onAddReply={handleAddReply}
          onUpdateReply={handleUpdateReply}
          onDeleteReply={handleDeleteReply}
        />
      ))}

      <InfiniteScrollLoader isLoading={isLoading} observerRef={observerRef} />

      {!hasMore && comments.length > 0 && (
        <EndOfContentMessage message="더 이상 댓글이 없습니다." />
      )}
    </div>
  );
}
