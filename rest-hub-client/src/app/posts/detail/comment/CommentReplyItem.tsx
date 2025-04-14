import Image from 'next/image';
import { useState } from 'react';

import CommentActionBar from './CommentActionBar';
import CommentEditForm from './CommentEditForm';

import CommentDropdownMenu from '@/components/ui/dropdownMenu/CommentDropdownMenu';
import { COMMENT_REPLY_MENU_ITEM_TYPES, MODAL_TYPES, PROFILE_IMAGE_DEFAULT } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/comment/commentReplyItem.module.css';
import { Comment } from '@/types';
import { apiRequest } from '@/utils/apiRequest';
import { formatTimeAgo } from '@/utils/format';

interface CommentReplyItemProps {
  reply: Comment;
  onUpdateReply: (updated: Comment) => void;
  onDeleteReply: (replyId: string) => void;
  onUpdateReplyLikeStatus: (replyId: string, isLiked: boolean, likesCount: number) => void;
  onUpdateCommentRepliesCount: (commentId: string, repliesCount: number) => void;
}

export default function CommentReplyItem({
  reply,
  onUpdateReply,
  onDeleteReply,
  onUpdateReplyLikeStatus,
  onUpdateCommentRepliesCount,
}: CommentReplyItemProps) {
  const {
    id: replyId,
    user: writer,
    content,
    createdAt,
    likesCount,
    post,
    isLiked,
    parentId,
  } = reply;
  const { id: postId } = post;

  if (!parentId) {
    console.error('Invalid reply: parentId is missing');
    return null;
  }

  const [editedContent, setEditedContent] = useState<string>(content);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { logout } = useAuth();
  const { openModal } = useModal();
  const currentUser = useProtectedUser();

  const fromNow = formatTimeAgo(createdAt);

  /** 답글 수정 요청 */
  const handleReplyEdit = async () => {
    if (!editedContent.trim()) {
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        content: editedContent,
      };

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.patch(
          `${API_ENDPOINTS.POST}/${postId}/comments/${parentId}/replies/${replyId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      }, logout);

      onUpdateReply(data.body);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update reply:', error);
      setMessage('답글 수정 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /** 답글 수정 취소 */
  const cancelEdit = async () => {
    setEditedContent(content);
    setMessage(null);
    setIsEditing(false);
  };

  /** 드롭다운 메뉴 선택 핸들러 (수정 / 삭제) */
  const handleReplyMenuItem = (value: number) => {
    switch (value) {
      case COMMENT_REPLY_MENU_ITEM_TYPES.UPDATE:
        setIsEditing(true);
        break;
      case COMMENT_REPLY_MENU_ITEM_TYPES.DELETE:
        openModal(MODAL_TYPES.COMMENT_REPLY_DELETE, {
          postId,
          parentId,
          replyId,
          deleteCommentReply: onDeleteReply,
          updateCommentRepliesCount: onUpdateCommentRepliesCount,
        });
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* 답글 작성 유저 프로필 */}
      <div className={styles.replyWriterProfileImageContainer}>
        <Image
          src={writer.profileImage || PROFILE_IMAGE_DEFAULT}
          alt="User Profile"
          width={24}
          height={24}
          priority
          className={styles.profileIcon}
        />
      </div>
      <div className={styles.replyContentContainer}>
        <div className={styles.replyContentWrapper}>
          {isEditing ? (
            <CommentEditForm
              content={editedContent}
              onChange={setEditedContent}
              onSubmit={handleReplyEdit}
              onCancel={cancelEdit}
              isLoading={isLoading}
              errorMessage={message}
            />
          ) : (
            <div className={styles.replyTextContainer}>
              {/* 답글 작성 유저 정보 */}
              <div className={styles.replyWriterInfo}>
                <div className={styles.username}>{writer.username}</div>
                <div className={styles.timaAgo}>{fromNow}</div>
              </div>

              {/* 답글 내용 */}
              <div className={styles.replyTextContent}>
                <div className={styles.text}>{content}</div>
              </div>

              {/* 답글 액션 바 */}
              <div className={styles.replyActionBar}>
                <CommentActionBar
                  commentId={replyId}
                  postId={postId}
                  isLiked={isLiked}
                  likesCount={likesCount}
                  onUpdateCommentLikeStatus={onUpdateReplyLikeStatus}
                />
              </div>
            </div>
          )}

          {/* 답글 메뉴 드롭다운 */}
          <CommentDropdownMenu
            userId={currentUser.id}
            writerId={writer.id}
            open={isDropdownOpen}
            setOpen={setIsDropdownOpen}
            onSelectMenuItem={handleReplyMenuItem}
          />
        </div>
      </div>
    </div>
  );
}
