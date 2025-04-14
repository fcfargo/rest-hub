import classNames from 'classnames';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

import CommentEditForm from './CommentEditForm';
import CommentReplyItem from './CommentReplyItem';

import { PROFILE_IMAGE_DEFAULT } from '@/constants';
import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentReply.module.css';
import { Comment } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

interface CommentReplyProps {
  userProfileImage: string | null;
  parentId: string;
  postId: string;
  initialCount: number;
  isReplying: boolean;
  setIsReplying: Dispatch<SetStateAction<boolean>>;
  onUpdateCommentRepliesCount: (commentId: string, repliesCount: number) => void;
}

type FetchRepliesResponseData = {
  replies: Comment[];
  meta: {
    currentPage: number;
    totalPages: number;
  };
};

export default function CommentReply({
  userProfileImage,
  parentId,
  postId,
  initialCount,
  isReplying,
  setIsReplying,
  onUpdateCommentRepliesCount,
}: CommentReplyProps) {
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialCount > 0);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { logout } = useAuth();

  const updateRepliesPagination = (
    data: FetchRepliesResponseData,
    pageIncrement: boolean = true,
  ) => {
    const { replies: newReplies, meta } = data;
    const { totalPages } = meta;
    setReplies((prev) => [...prev, ...newReplies]);
    setHasMore(currentPage < totalPages);
    if (pageIncrement) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /** 답글 isLiked, likesCount를 업데이트 */
  const updateReplyLikeStatus = (replyId: string, isLiked: boolean, likesCount: number) => {
    setReplies((prev) => prev.map((c) => (c.id === replyId ? { ...c, isLiked, likesCount } : c)));
  };

  /** 대댓글 수정 핸들러 */
  const updateReply = (updated: Comment) => {
    setReplies((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
  };

  /** 대댓글 삭제 핸들러 */
  const deleteReply = (replyId: string) => {
    setReplies((prev) => prev.filter((c) => c.id !== replyId));
  };

  /** 답글 추가 핸들러 */
  const addReply = (reply: Comment) => {
    setReplies((prev) => [reply, ...prev]);
  };

  /** 답글 등록 */
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload = { content: replyContent };
      const { data } = await apiRequest(async (accessToken: string) => {
        return api.post(`${API_ENDPOINTS.POST}/${postId}/comments/${parentId}/reply`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      const { reply, parentRepliesCount } = data.body;
      onUpdateCommentRepliesCount(parentId, parentRepliesCount);
      addReply(reply);
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to create reply:', error);
      setMessage('답글 작성 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /** 답글 등록 취소 */
  const handleReplySubmitCancle = async () => {
    setReplyContent('');
    setMessage(null);
    setIsReplying(false);
  };

  /** 답글 목록 가져오기 */
  const fetchReplies = async (pageNum: number) => {
    const { data } = await apiRequest(
      (accessToken: string) =>
        api.get(`${API_ENDPOINTS.POST}/${postId}/comments/${parentId}/replies`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page: pageNum, limit: 10 },
        }),
      logout,
    );

    return data.body;
  };

  /** 답글 영역 열기/닫기 토글 및 첫 로딩 시 데이터 요청 */
  const handleToggleReplies = async () => {
    if (!isRepliesOpen && replies.length === 0) {
      try {
        const data = await fetchReplies(1);
        updateRepliesPagination(data, false);
        setCurrentPage(2);
      } catch (error) {
        console.error('Failed to fetch reply:', error);
      }
    }
    setIsRepliesOpen((prev) => !prev);
  };

  /** 답글 더보기 버튼 클릭 시 다음 페이지의 답글을 추가로 불러옴 */
  const handleLoadMoreReplies = async () => {
    try {
      const data = await fetchReplies(currentPage);
      updateRepliesPagination(data);
    } catch (error) {
      console.error('Failed to fetch reply:', error);
    }
  };

  return (
    <div className={styles.repliesWrapper}>
      {isReplying && (
        <div className={styles.replyComposer}>
          <div className={styles.replyProfileImageContainer}>
            <Image
              src={userProfileImage || PROFILE_IMAGE_DEFAULT}
              alt="User Profile"
              width={24}
              height={24}
              priority
              className={styles.profileIcon}
            />
          </div>
          <div className={styles.replyEditorArea}>
            <CommentEditForm
              content={replyContent}
              onChange={setReplyContent}
              onSubmit={handleReplySubmit}
              onCancel={handleReplySubmitCancle}
              isLoading={isLoading}
              errorMessage={message}
            />
          </div>
        </div>
      )}

      {initialCount > 0 && (
        <button className={styles.replyToggleButton} onClick={handleToggleReplies}>
          <div className={styles.replyToggleContent}>
            <Image
              className={classNames(styles.replyArrowIcon, isRepliesOpen && styles.expanded)}
              src="/settings/arrow.svg"
              alt="Toggle Button Icon"
              width={16}
              height={16}
            />
            <p className={styles.replyToggleText}>답글 {initialCount}개</p>
          </div>
        </button>
      )}

      {isRepliesOpen && (
        <>
          <div className={styles.repliesList}>
            {replies.map((reply) => (
              <CommentReplyItem
                key={reply.id}
                reply={reply}
                onUpdateReply={updateReply}
                onDeleteReply={deleteReply}
                onUpdateReplyLikeStatus={updateReplyLikeStatus}
                onUpdateCommentRepliesCount={onUpdateCommentRepliesCount}
              />
            ))}
          </div>

          {hasMore && (
            <button className={styles.loadMoreButton} onClick={handleLoadMoreReplies}>
              답글 더보기
            </button>
          )}
        </>
      )}
    </div>
  );
}
