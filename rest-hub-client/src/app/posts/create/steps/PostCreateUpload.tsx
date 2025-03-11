'use client';

import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';

import { PostDataProps } from '../postCreateModal';

import { MEDIA_TYPES } from '@/constants';
import styles from '@/styles/posts/postCreateModal.module.css';

interface PostCreateUploadProps {
  nextStep: () => void;
  setPostData: Dispatch<SetStateAction<PostDataProps>>;
}

export default function PostCreateUpload({ nextStep, setPostData }: PostCreateUploadProps) {
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setMessage(null);
    const fileUrl = URL.createObjectURL(file);
    const fileExt = file.type.split('/')[0];

    if (![MEDIA_TYPES.IMAGE, MEDIA_TYPES.VIDEO].includes(fileExt)) {
      setMessage('지원되지 않는 파일 형식입니다.');
      return;
    }

    setPostData((prev: PostDataProps) => ({
      ...prev,
      media: file,
      mediaType: fileExt,
      fileUrl,
    }));

    nextStep();
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>새 게시물 업로드</h2>
      </div>

      {/* 파일 업로드 영역 */}
      <div className={styles.uploadContainer}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.icon}
            src="/posts/upload-icon.svg"
            alt="Upload Icon"
            width={96}
            height={77}
          />
        </div>

        <p className={styles.description}>사진과 동영상을 여기에 끌어다 놓으세요</p>

        {/* 파일 선택 버튼 */}
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={triggerFileSelect}>
            컴퓨터에서 선택
          </button>
        </div>

        {/* 에러 메시지 출력 */}
        {message && <p className={styles.failedMessage}>{message}</p>}

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept={`${MEDIA_TYPES.IMAGE}/*, ${MEDIA_TYPES.VIDEO}/*`}
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
      </div>
    </div>
  );
}
