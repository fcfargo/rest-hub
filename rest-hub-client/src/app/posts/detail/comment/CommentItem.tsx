import { PROFILE_IMAGE_DEFAULT } from '@/constants';
import styles from '@/styles/comment/commentItem.module.css';
import { Comment } from '@/types';
import { formatTimeAgo } from '@/utils/format';
import classNames from 'classnames';
import Image from 'next/image';
import { useRef, useState } from 'react';

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

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const { user, content, createdAt, likesCount } = comment;

  const fromNow = formatTimeAgo(createdAt);

  /** 좋아요 버튼 클릭 핸들러 */
  const handleLikeButtonClick = async () => {};

  /** 답글 버튼 클릭 핸들러 */
  const handleReplyButtonClick = async () => {};

  return (
    <div className={styles.container}>
      {/* 댓글 작성 유저 프로필 */}
      <div className={styles.writerProfileImageContainer}>
        <Image
          src={user.profileImage || PROFILE_IMAGE_DEFAULT}
          alt="User Profile"
          width={40}
          height={40}
          className={styles.profileIcon}
        />
      </div>
      <div className={styles.contentContainer}>
        {/* 댓글 작성 유저 정보 */}
        <div className={styles.writerProfileInfoContainer}>
          <div className={styles.username}>{user.username}</div>
          <div className={styles.timaAgo}>{fromNow}</div>
        </div>

        {/* 댓글 내용 */}
        <div className={styles.writerContentContainer}>
          <div className={styles.content}>{content}</div>
        </div>

        {/* 댓글 액션 바 */}
        <div className={styles.commentActionBarContainer}>
          {/* 좋아요 버튼 */}
          <button onClick={handleLikeButtonClick} className={classNames(styles.likesButton)}>
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
          <button onClick={handleReplyButtonClick} className={classNames(styles.replyButton)}>
            <p className={styles.reply}>답글</p>
          </button>
        </div>
      </div>
      {/* 댓글 메뉴 버튼 */}
      <div className={styles.menuContainer}>
        <button
          ref={moreButtonRef}
          className={styles.moreButton}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-label="Post menu"
          aria-expanded={isDropdownOpen}
        >
          <Image
            src="/comment/menu.svg"
            alt="More"
            width={16}
            height={16}
            className={styles.moreButtonIcon}
          />
        </button>
      </div>
    </div>
  );
}
