'use client';

import classNames from 'classnames';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import styles from '@/styles/utils/textContent.module.css';

interface TextContentProps {
  textContent: string;
  setTextContent: Dispatch<SetStateAction<string>>;
}

export default function TextContent({ textContent, setTextContent }: TextContentProps) {
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  /** 이모지 추가 */
  const addEmoji = useCallback((emojiObject: { emoji: string }) => {
    setTextContent((prev) => prev + emojiObject.emoji);
  }, []);

  /** 게시글 작성 */
  const handleTextWrite = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  }, []);

  /** 외부 클릭 감지하여 이모지 닫기 */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(target)
      ) {
        setShowPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        {/* 이모지 버튼 */}
        <button
          ref={emojiButtonRef}
          onClick={() => {
            setShowPicker((prev) => !prev);
          }}
          className={styles.emojiButton}
        >
          <Image
            className={styles.emojiIcon}
            src="/posts/emoji.svg"
            alt="Emoji Icon"
            width={20}
            height={20}
          />
        </button>

        {/* ✨ 이모지 피커 */}
        <div
          ref={pickerRef}
          className={classNames(styles.emojiPickerContainer, showPicker && styles.active)}
        >
          <EmojiPicker searchDisabled={true} width={320} height={320} onEmojiClick={addEmoji} />
        </div>

        {/* 글자 수 표시 */}
        <div className={styles.contentLength}>{textContent.length}/2200</div>
      </div>
    </div>
  );
}
