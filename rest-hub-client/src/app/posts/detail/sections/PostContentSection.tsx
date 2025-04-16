'use client';

import classNames from 'classnames';
import { useState } from 'react';

import styles from '@/styles/post/postContent.module.css';

interface PostContentSectionProps {
  content: string;
  hasMediaData: boolean;
  showToggleButton?: boolean;
}

export default function PostContentSection({
  content,
  hasMediaData,
  showToggleButton = true,
}: PostContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const lineCount = content.split('\n').length;

  // 더보기 버튼 표시 조건
  const showMoreButton =
    showToggleButton &&
    !isExpanded &&
    ((hasMediaData && (content.length > 50 || lineCount > 1)) ||
      (!hasMediaData && (content.length > 300 || lineCount > 3)));

  // 줄 수 제한 클래스 적용
  const contentClampClass =
    showToggleButton && !isExpanded ? (hasMediaData ? styles.clamp1 : styles.clamp5) : undefined;

  return (
    <section className={styles.contentContainer} aria-label="Post content">
      {/* 게시글 내용 */}
      <p className={classNames(styles.content, contentClampClass)} aria-expanded={isExpanded}>
        {content}
      </p>

      {/* 더 보기 버튼 */}
      {showMoreButton && (
        <button
          onClick={() => setIsExpanded(true)}
          className={styles.readMoreButton}
          aria-label="Show full content"
        >
          더 보기
        </button>
      )}
    </section>
  );
}
