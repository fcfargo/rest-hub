'use client';

import Image from 'next/image';

import { PROFILE_IMAGE_DEFAULT } from '@/constants';
import styles from '@/styles/posts/postItem.module.css';
import { Post } from '@/types';
import { formatTimeAgo, getFormattedLocation } from '@/utils/format';

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const { createdAt, location, user, content, imageUrl, likesCount } = post;

  const fromNow = formatTimeAgo(createdAt);

  const formattedLocation = location ? getFormattedLocation(location) : null;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 프로필 영역 */}
        <div className={styles.profile}>
          <div className={styles.userInfo}>
            <Image
              src={user.profileImage || PROFILE_IMAGE_DEFAULT}
              alt="User Profile"
              width={40}
              height={40}
              className={styles.profileIcon}
            />
            <div className={styles.userDetails}>
              <div className={styles.userHeader}>
                <div className={styles.username}>{user.username}</div>
                <button className={styles.follow}>팔로우</button>
              </div>
              <div className={styles.userFooter}>
                <div className={styles.timaAgo}>{fromNow}</div>
                {formattedLocation && (
                  <>
                    <span className={styles.separator}>•</span>
                    <div className={styles.location}>{formattedLocation}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className={styles.moreButton}>
            <Image
              src="/posts/ellipsis.svg"
              alt="More"
              width={24}
              height={24}
              className={styles.moreButtonIcon}
            />
          </button>
        </div>

        {/* 게시글 텍스트 내용 */}
        <p className={styles.content}>{content}</p>

        {/* 게시글 이미지(여러 장 처리 로직은 추후 추가 예정 */}
        {imageUrl?.trim() && (
          <div className={styles.singleImageContainer}>
            <Image
              src={imageUrl}
              alt="Post Image"
              priority
              width={0}
              height={0}
              sizes="100vw"
              style={{
                objectFit: 'contain',
                width: '100%',
                height: 'auto',
                display: 'flex',
              }}
            />
          </div>
        )}

        {/* 하단 좋아요 및 댓글 영역 */}
        <div className={styles.footer}>
          {/* 좋아요 버튼 */}
          <button className={styles.likesButton} aria-label="Like post">
            <Image
              src="/posts/heart.svg"
              alt="Likes"
              width={20}
              height={20}
              className={styles.footerIcon}
            />
            <span className={styles.likesCount}>{likesCount}</span>
          </button>

          {/* 댓글 버튼 */}
          <button className={styles.commentsButton} aria-label="View comments">
            <Image
              src="/posts/message-square-text.svg"
              alt="Comments"
              width={20}
              height={20}
              className={styles.fotterIcon}
            />
            <span className={styles.commentsCount}>0</span>
          </button>
        </div>
      </div>
    </div>
  );
}
