'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import FileUploadField from '@/components/forms/FileUploadField';
import { CloseButtonBlack } from '@/components/ui/closeButton';
import { useModal } from '@/context/modalContext';
import styles from '@/styles/post/postCreate.module.css';
import { PostDataProps } from '@/types';
import { processMediaFile } from '@/utils/fileProcessor';

interface PostCreateUploadProps {
  nextStep: () => void;
  setPostData: Dispatch<SetStateAction<PostDataProps>>;
}

export default function PostCreateUpload({ nextStep, setPostData }: PostCreateUploadProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { closeModal } = useModal();

  const handleFile = (file: File | null) => {
    const result = processMediaFile(file, ['image']); // image만 허용

    if (!result.success) {
      setMessage(result.errorMessage);
      return;
    }

    const { file: validFile, fileUrl, fileType } = result;

    setMessage(null);

    setPostData((prev: PostDataProps) => ({
      ...prev,
      media: validFile,
      mediaType: fileType,
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
        <div className={styles.mobileCloseButtonContainer}>
          <CloseButtonBlack onClick={() => closeModal()} />
        </div>
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
            src="/post/upload-icon.svg"
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
