'use client';

import Image from 'next/image';
import styles from '@/styles/utils/scrollBoundaryIndicators.module.css';

interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

interface EndOfContentMessageProps {
  message?: string;
}

{
  /* 로딩 인디케이터 */
}
export function InfiniteScrollLoader({ isLoading, observerRef }: InfiniteScrollLoaderProps) {
  return (
    <div ref={observerRef} className={styles.loader}>
      {isLoading && (
        <Image
          className={styles.icon}
          src="/posts/loading.gif"
          alt="Loading more content"
          width={24}
          height={24}
          priority
        />
      )}
    </div>
  );
}

{
  /* 더 이상 데이터가 없을 때 표시되는 메시지 */
}
export function EndOfContentMessage({
  message = '더 이상 항목이 없습니다.',
}: EndOfContentMessageProps) {
  return (
    <div className={styles.endMessage}>
      <p>{message}</p>
    </div>
  );
}
