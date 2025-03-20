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
  const { createdAt, location } = post;

  const fromNow = formatTimeAgo(createdAt);
  const formattedLoacation = location ? getFormattedLocation(location) : null;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 상단 프로필 */}
        <div className={styles.profile}>
          <div className={styles.userInfo}>
            <Image
              src={post.user.profileImage || PROFILE_IMAGE_DEFAULT}
              alt="User Profile"
              width={40}
              height={40}
              className={styles.profileIcon}
            />
            <div className={styles.userDetails}>
              <div className={styles.userHeader}>
                <div className={styles.username}>{post.user.username}</div>
                <button className={styles.follow}>팔로우</button>
              </div>
              <div className={styles.userFooter}>
                <div className={styles.timaAgo}>{fromNow}</div>
                {location && <span className={styles.seperator}>•</span>}
                {location && <div className={styles.location}>{formattedLoacation}</div>}
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

        {/* 게시글 내용 */}
        <p className={styles.content}>{post.content}</p>

        {/* 이미지(이미지 개수 여러 개 일 경우를 고려하는 로직은 추후 개선 예정 */}
        {post.imageUrl && post.imageUrl.trim() ? (
          <div className={styles.singleImageContainer}>
            <Image
              src={post.imageUrl}
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
        ) : null}

        {/* 하단 아이콘 및 카운트 */}
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
            <span className={styles.likesCount}>{post.likesCount}</span>
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
