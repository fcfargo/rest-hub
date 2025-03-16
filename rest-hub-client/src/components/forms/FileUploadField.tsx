import { ChangeEvent, useRef } from 'react';

import { ErrorMessage } from '../ui/message';

import { INPUT_TYPES, MEDIA_TYPES } from '@/constants';
import styles from '@/styles/forms/fileUploadField.module.css';

interface FileUploadFieldProps {
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  errorMessage?: string | null;
}

export default function FileUploadField({
  handleFileChange,
  accept = `${MEDIA_TYPES.IMAGE}/*, ${MEDIA_TYPES.VIDEO}/*`,
  errorMessage,
}: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className={styles.uploadContainer}>
      {/* 파일 선택 버튼 */}
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={triggerFileSelect}>
          파일 선택
        </button>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type={INPUT_TYPES.FILE}
        accept={accept}
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      {/* 에러 메시지 출력 */}
      {errorMessage && <ErrorMessage message={errorMessage} className="mt-1" />}
    </div>
  );
}
