'use client';

import classNames from 'classnames';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import styles from '@/styles/utils/emojiButton.module.css';
import { TextValueUpdater } from '@/types';

interface EmojiButtonProps {
  setTextContent: Dispatch<SetStateAction<string>> | ((next: TextValueUpdater) => void);
  className?: string;
  iconSize?: number;
}

export default function EmojiButton({
  setTextContent,
  className,
  iconSize = 20,
}: EmojiButtonProps) {
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  /** 이모지 추가 */
  const addEmoji = useCallback((emojiObject: { emoji: string }) => {
    setTextContent((prev) => prev + emojiObject.emoji);
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
    <div className={styles.container}>
      {/* 이모지 버튼 */}
      <button
        ref={emojiButtonRef}
        onClick={() => {
          setShowPicker((prev) => !prev);
        }}
        className={styles.emojiButton}
      >
        <Image
          src="/post/emoji.svg"
          alt="Emoji Icon"
          width={iconSize}
          height={iconSize}
          style={{ width: iconSize, height: iconSize }}
        />
      </button>

      {/* ✨ 이모지 피커 */}
      <div
        ref={pickerRef}
        className={classNames(styles.emojiPickerContainer, className, showPicker && styles.active)}
      >
        <EmojiPicker searchDisabled={true} width={320} height={320} onEmojiClick={addEmoji} />
      </div>
    </div>
  );
}
