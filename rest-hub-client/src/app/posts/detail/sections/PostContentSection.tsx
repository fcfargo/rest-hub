'use client';

import classNames from 'classnames';
import { useState } from 'react';

import styles from '@/styles/posts/postContent.module.css';

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

  // 게시글에 더보기 버튼 표시 여부: 미디어 데이터 포함된 경우 1줄, 포함되지 않았을 경우 5줄 이상일 때
  const showMoreButton =
    showToggleButton &&
    !isExpanded &&
    ((hasMediaData && content.length > 50) || (!hasMediaData && content.length > 300));

  return (
    <div className={styles.contentContainer}>
      <p
        className={classNames(
          styles.content,
          showToggleButton && !isExpanded && (hasMediaData ? styles.clamp1 : styles.clamp5),
        )}
      >
        {content}
      </p>

      {showMoreButton && (
        <button onClick={() => setIsExpanded(true)} className={styles.readMoreButton}>
          더 보기
        </button>
      )}
    </div>
  );
}
