'use client';

import Image from 'next/image';
import { useState } from 'react';

import PostCreateCrop from './steps/PostCreateCrop';
import PostCreateUpload from './steps/PostCreateUpload';

import { POST_CREATE_STEPS } from '@/constants';
import { useModal } from '@/context/modalContext';
import styles from '@/styles/posts/postCreateModal.module.css';

export interface PostDataProps {
  media: File | null;
  mediaType: string;
  caption: string;
  fileUrl: string;
}

export default function PostCreateModal() {
  const { closeModal } = useModal();
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostDataProps>({
    media: null,
    mediaType: '',
    caption: '',
    fileUrl: '',
  });

  const changeStep = (newStep: number) => {
    setStep(Math.max(POST_CREATE_STEPS.ONE, Math.min(newStep, POST_CREATE_STEPS.THREE)));
  };

  return (
    <div className={styles.overlay}>
      {/* 닫기 버튼 */}
      <button className={styles.closeButton} onClick={() => closeModal()}>
        <Image
          className={styles.cancelIcon}
          src="/settings/cancel-white.svg"
          alt="Close"
          width={24}
          height={24}
        />
      </button>

      {/* stage 별 게시글 생성 영역 */}
      <div className={styles.container}>
        {step === POST_CREATE_STEPS.ONE && (
          <PostCreateUpload
            nextStep={() => changeStep(POST_CREATE_STEPS.TWO)}
            setPostData={setPostData}
          />
        )}
        {step === POST_CREATE_STEPS.TWO && (
          <PostCreateCrop
            nextStep={() => changeStep(POST_CREATE_STEPS.THREE)}
            prevStep={() => changeStep(POST_CREATE_STEPS.ONE)}
            setPostData={setPostData}
            fileUrl={postData.fileUrl}
            mediaType={postData.mediaType}
          />
        )}
      </div>
    </div>
  );
}
