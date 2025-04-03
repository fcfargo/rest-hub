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

interface CommentSectionProps {
  postId: string;
  onAddComment: (newComment: Comment) => void;
}

export default function CommentInput({ postId, onAddComment }: CommentSectionProps) {
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

      const payload = {};

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

  /** 키 입력 감지 함수 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 사용자가 Enter 키를 누를 경우
    if (e.key === KEY_DOWNS.ENTER && !e.shiftKey) {
      e.preventDefault();
      handleCommentCreate();
    }
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.commentFooter}>
        <EmojiButton setTextContent={setComment} className="bottom-[-8px] left-[-244px]" />

        {/* 게시글 등록 버튼 */}
        <button className={styles.button} onClick={handleCommentCreate} disabled={!comment.trim()}>
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
