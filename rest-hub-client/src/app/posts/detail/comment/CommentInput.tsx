'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import EmojiButton from '@/components/ui/EmojiButton';
import { KEY_DOWNS } from '@/constants';
import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentInput.module.css';
import { Comment } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

interface CommentInputProps {
  postId: string;
  parentId?: string;
  onAddComment: (newComment: Comment) => void;
}

export default function CommentInput({ postId, parentId, onAddComment }: CommentInputProps) {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useAuth();

  const maxLength = 250;
  const rows = 1;

  /** 댓글 입력 */
  const handleCommentInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  }, []);

  /** 댓글 등록 */
  const handleCommentCreate = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      const payload = { content: comment, parentId: parentId ? parentId : null };

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.post(`${API_ENDPOINTS.POST}/${postId}/comment`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      onAddComment(data.body);
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setComment('');
      setIsLoading(false);
    }
  };

  /** Enter 키 입력 시 제출 (Shift + Enter는 줄바꿈 허용) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === KEY_DOWNS.ENTER && !e.shiftKey) {
      e.preventDefault();
      handleCommentCreate();
    }
  };

  return (
    <div className={styles.container}>
      {/* 댓글 입력창 */}
      <div className={styles.commentText}>
        {comment.length === 0 && <p className={styles.placeholder}>댓글을 입력하세요...</p>}
        <textarea
          className={styles.textarea}
          maxLength={maxLength}
          value={comment}
          rows={rows}
          onChange={handleCommentInput}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 이모지 + 등록 버튼 */}
      <div className={styles.commentFooter}>
        <EmojiButton setTextContent={setComment} className="bottom-[-8px] left-[-244px]" />
        <button
          className={styles.button}
          onClick={handleCommentCreate}
          disabled={!comment.trim() || isLoading}
          aria-label="Add comment"
        >
          <Image
            className={styles.icon}
            src="/comment/share.svg"
            alt="Share Icon"
            width={16}
            height={16}
          />
        </button>
      </div>
    </div>
  );
}
