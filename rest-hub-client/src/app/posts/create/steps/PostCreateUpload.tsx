'use client';

import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { PostDataProps } from '../postCreateModal';

import FileUploadField from '@/components/forms/FileUploadField';
import { MEDIA_TYPES } from '@/constants';
import styles from '@/styles/posts/postCreateModal.module.css';

interface PostCreateUploadProps {
  nextStep: () => void;
  setPostData: Dispatch<SetStateAction<PostDataProps>>;
}

export default function PostCreateUpload({ nextStep, setPostData }: PostCreateUploadProps) {
  const [message, setMessage] = useState<string | null>(null);

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

        <FileUploadField handleFileChange={handleFileChange} errorMessage={message} />
      </div>
    </div>
  );
}
