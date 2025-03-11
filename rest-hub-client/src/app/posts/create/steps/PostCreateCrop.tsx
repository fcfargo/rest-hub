'use client';

import { Dispatch, SetStateAction } from 'react';

import { PostDataProps } from '../postCreateModal';

import MediaPreview from '@/components/media/mediaPreview';
import modalStyles from '@/styles/posts/postCreateModal.module.css';

interface PostCreateCropProps {
  nextStep: () => void;
  prevStep: () => void;
  setPostData: Dispatch<SetStateAction<PostDataProps>>;
  fileUrl: string;
  mediaType: string;
}
export default function PostCreateCrop({
  nextStep,
  prevStep,
  setPostData,
  fileUrl,
  mediaType,
}: PostCreateCropProps) {
  return (
    <div className={modalStyles.wrapper}>
      {/* 헤더 */}
      <div className={modalStyles.header}>
        <h2 className={modalStyles.title}>게시물 편집</h2>
      </div>

      {/* 파일 업로드 영역 */}
      <MediaPreview preview={fileUrl} mediaType={mediaType} />
    </div>
  );
}
