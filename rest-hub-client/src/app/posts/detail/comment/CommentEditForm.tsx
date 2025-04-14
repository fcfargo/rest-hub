import { Dispatch, SetStateAction, useCallback } from 'react';

import EmojiButton from '@/components/ui/EmojiButton';
import { ErrorMessage } from '@/components/ui/message';
import { KEY_DOWNS } from '@/constants';
import styles from '@/styles/comment/commentEditForm.module.css';

interface CommentEditFormProps {
  content: string;
  onChange: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  submitLabel?: string;
}

export default function CommentEditForm({
  content,
  onChange,
  onSubmit,
  onCancel,
  isLoading = false,
  errorMessage,
  submitLabel = '저장',
}: CommentEditFormProps) {
  const maxLength = 250;
  const rows = 1;

  /** 내용 입력 */
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, []);

  /** Enter 키 입력 시 제출 (Shift + Enter는 줄바꿈 허용) */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === KEY_DOWNS.ENTER && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={styles.editContainer}>
      <textarea
        className={styles.textarea}
        maxLength={maxLength}
        value={content}
        rows={rows}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.editControls}>
        <EmojiButton setTextContent={onChange} className="top-[12px] left-[0px]" iconSize={14} />

        <div className={styles.actionButtons}>
          <button
            className={styles.confirmButton}
            onClick={onSubmit}
            disabled={!content.trim() || isLoading}
            aria-label="Submit"
          >
            {submitLabel}
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} className="!text-[11px] mt-[-4px]" />}
    </div>
  );
}
