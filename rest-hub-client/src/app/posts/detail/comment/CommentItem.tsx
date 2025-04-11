import Image from 'next/image';
import { useCallback, useState } from 'react';

import CommentActionBar from './CommentActionBar';

import CommentDropdownMenu from '@/components/ui/dropdownMenu/CommentDropdownMenu';
import EmojiButton from '@/components/ui/EmojiButton';
import { ErrorMessage } from '@/components/ui/message';
import {
  COMMENT_MENU_ITEM_TYPES,
  KEY_DOWNS,
  MODAL_TYPES,
  PROFILE_IMAGE_DEFAULT,
} from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentItem.module.css';
import { Comment } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { formatTimeAgo } from '@/utils/format';

interface CommentItemProps {
  comment: Comment;
  onUpdateComment: (updated: Comment) => void;
  onDeleteComment: (commentId: string) => void;
  onUpdateCommentLikeStatus: (commentId: string, isLiked: boolean, likesCount: number) => void;
  onAddReply: (parentId: string, reply: Comment) => void;
  onUpdateReply: (parentId: string, reply: Comment) => void;
  onDeleteReply: (parentId: string, reply: Comment) => void;
}

export default function CommentItem({
  comment,
  onUpdateComment,
  onDeleteComment,
  onUpdateCommentLikeStatus,
  onAddReply,
  onUpdateReply,
  onDeleteReply,
}: CommentItemProps) {
  const { id, user: writer, content, createdAt, likesCount, post, isLiked } = comment;
  const { id: postId } = post;

  const [editedContent, setEditedContent] = useState<string>(content);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { openModal } = useModal();
  const { logout } = useAuth();
  const currentUser = useProtectedUser();

  const fromNow = formatTimeAgo(createdAt);
  const maxLength = 250;
  const rows = 1;

  /** 댓글 입력 */
  const handleCommentInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  }, []);

  /** 댓글 수정 */
  const handleCommentUpdate = async () => {
    if (!content.trim()) {
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        content: editedContent,
      };

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.patch(`${API_ENDPOINTS.POST}/${postId}/comments/${comment.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      onUpdateComment(data.body);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
      setMessage('댓글 수정 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /** 댓글 수정 취소 */
  const handleCommentUpdateCancle = async () => {
    setEditedContent(content);
    setMessage(null);
    setIsEditing(false);
  };

  /** Enter 키 입력 시 제출 (Shift + Enter는 줄바꿈 허용) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === KEY_DOWNS.ENTER && !e.shiftKey) {
      e.preventDefault();
      handleCommentUpdate();
    }
  };

  /** 드롭다운 메뉴 클릭 처리 */
  const handleCommentMenuItem = (value: number) => {
    switch (value) {
      case COMMENT_MENU_ITEM_TYPES.UPDATE:
        setIsEditing(true);
        break;
      case COMMENT_MENU_ITEM_TYPES.DELETE:
        openModal(MODAL_TYPES.COMMENT_DELETE, {
          postId,
          commentId: id,
          deleteComment: onDeleteComment,
        });
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  /** 답글 버튼 클릭 핸들러 */
  const handleReplyButtonClick = async () => {};

  return (
    <div className={styles.container}>
      {/* 댓글 작성 유저 프로필 */}
      <div className={styles.writerProfileImageContainer}>
        <Image
          src={writer.profileImage || PROFILE_IMAGE_DEFAULT}
          alt="User Profile"
          width={40}
          height={40}
          className={styles.profileIcon}
        />
      </div>
      <div className={styles.commentContainer}>
        {isEditing ? (
          <div className={styles.editContainer}>
            <textarea
              className={styles.textarea}
              maxLength={maxLength}
              value={editedContent}
              rows={rows}
              onChange={handleCommentInput}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.editControls}>
              <EmojiButton setTextContent={setEditedContent} className="top-[12px] left-[0px]" />

              <div className={styles.actionButtons}>
                <button
                  className={styles.confirmButton}
                  onClick={handleCommentUpdate}
                  disabled={!editedContent.trim() || isLoading}
                  aria-label="Edit comment"
                >
                  저장
                </button>
                <button className={styles.cancelButton} onClick={handleCommentUpdateCancle}>
                  취소
                </button>
              </div>
            </div>
            {message && <ErrorMessage message={message} className="!text-[11px] mt-[-4px]" />}
          </div>
        ) : (
          <div className={styles.contentContainer}>
            {/* 댓글 작성 유저 정보 */}
            <div className={styles.writerProfileInfoContainer}>
              <div className={styles.username}>{writer.username}</div>
              <div className={styles.timaAgo}>{fromNow}</div>
            </div>

            {/* 댓글 내용 */}
            <div className={styles.writerContentContainer}>
              <div className={styles.content}>{content}</div>
            </div>

            {/* 댓글 액션 바 */}
            <div className={styles.commentActionBarContainer}>
              <CommentActionBar
                commentId={id}
                postId={postId}
                isLiked={isLiked}
                likesCount={likesCount}
                onUpdateCommentLikeStatus={onUpdateCommentLikeStatus}
              />

              {/* 답글 버튼 */}
              <button onClick={handleReplyButtonClick} className={styles.replyButton}>
                <p className={styles.reply}>답글</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 댓글 메뉴 버튼 */}
      <CommentDropdownMenu
        userId={currentUser.id}
        writerId={writer.id}
        open={isDropdownOpen}
        setOpen={setIsDropdownOpen}
        onSelectMenuItem={handleCommentMenuItem}
      />
    </div>
  );
}
