'use client';

import classNames from 'classnames';
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
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    const fileExt = file.type.split('/')[0];

    if (![MEDIA_TYPES.IMAGE].includes(fileExt)) {
      setMessage('지원되지 않는 파일 형식입니다.');
      return;
    }

    setMessage(null);

    setPostData((prev: PostDataProps) => ({
      ...prev,
      media: file,
      mediaType: fileExt,
      fileUrl,
    }));

    nextStep();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0] || null;
    handleFile(file);
  };

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>새 게시물 업로드</h2>
      </div>

      {/* 파일 업로드 영역 */}
      <div
        className={classNames(styles.uploadContainer, { [styles.dragging]: isDragging })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
