'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';

import EmojiButton from './EmojiButton';

import styles from '@/styles/utils/textContent.module.css';

interface TextContentProps {
  textContent: string;
  setTextContent: Dispatch<SetStateAction<string>>;
}

export default function TextContent({ textContent, setTextContent }: TextContentProps) {
  /** 게시글 작성 */
  const handleTextWrite = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  }, []);

  return (
    <div className={styles.postContent}>
      <textarea
        className={styles.postContentText}
        value={textContent}
        onChange={handleTextWrite}
        placeholder="Write a post..."
        maxLength={2200}
      />
      <div className={styles.postContentFooter}>
        <EmojiButton setTextContent={setTextContent} className="top-[-48px] left-[-12px]" />

        {/* 글자 수 표시 */}
        <div className={styles.contentLength}>{textContent.length}/2200</div>
      </div>
    </div>
  );
}
