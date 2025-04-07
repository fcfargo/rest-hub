import Image from 'next/image';
import { useState } from 'react';

import CommentDropdownMenu from '@/components/ui/dropdownMenu/CommentDropdownMenu';
import { COMMENT_MENU_ITEM_TYPES, PROFILE_IMAGE_DEFAULT } from '@/constants';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import styles from '@/styles/comment/commentItem.module.css';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/utils/format';

interface CommentItemProps {
  comment: Comment;
  onUpdateComment: (updated: Comment) => void;
  onDeleteComment: (commentId: string) => void;
  onAddReply: (parentId: string, reply: Comment) => void;
  onUpdateReply: (parentId: string, reply: Comment) => void;
  onDeleteReply: (parentId: string, reply: Comment) => void;
}

export default function CommentItem({
  comment,
  onUpdateComment,
  onDeleteComment,
  onAddReply,
  onUpdateReply,
  onDeleteReply,
}: CommentItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user: writer, content, createdAt, likesCount } = comment;
  const currentUser = useProtectedUser();

  const fromNow = formatTimeAgo(createdAt);

  /** 좋아요 버튼 클릭 핸들러 */
  const handleLikeButtonClick = async () => {};

  /** 답글 버튼 클릭 핸들러 */
  const handleReplyButtonClick = async () => {};

  /** 드롭다운 메뉴 클릭 처리 */
  const handleCommentMenuItem = (value: number) => {
    switch (value) {
      case COMMENT_MENU_ITEM_TYPES.UPDATE:
        console.log('update');
        break;
      case COMMENT_MENU_ITEM_TYPES.DELETE:
        console.log('delete');
        break;
      default:
        break;
    }
    setIsDropdownOpen(false);
  };

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
          {/* 좋아요 버튼 */}
          <button onClick={handleLikeButtonClick} className={styles.likesButton}>
            <Image
              src="/post/heart.svg"
              alt="Likes icon"
              width={14}
              height={14}
              className={styles.icon}
            />
          </button>

          <p className={styles.likesCount}>{likesCount}</p>

          {/* 답글 버튼 */}
          <button onClick={handleReplyButtonClick} className={styles.replyButton}>
            <p className={styles.reply}>답글</p>
          </button>
        </div>
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
