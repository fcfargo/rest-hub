'use client';

import { useState } from 'react';

import PostCreateCrop from './steps/PostCreateCrop';
import PostCreateDetails from './steps/PostCreateDetails';
import PostCreateUpload from './steps/PostCreateUpload';
import { CloseButtonWhite } from '@/components/ui/closeButton';
import { POST_CREATE_STEPS } from '@/constants';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import { useProtectedUser } from '@/hooks/useProtectedUser';
import styles from '@/styles/posts/postCreateModal.module.css';
import { PostDataProps } from '@/types';

export default function PostCreateModal() {
  const { closeModal } = useModal();
  const [step, setStep] = useState(1);
  const [postData, setPostData] = useState<PostDataProps>({
    media: null, // 원본 미디어 파일
    mediaType: '', // image(video)
    caption: '',
    fileUrl: '', // 원본 파일 URL
    croppedFile: null, //  크롭된 파일
    croppedUrl: '', //  크롭된 파일 미리보기 URL
  });

  const isMounted = useMounted();

  const user = useProtectedUser();

  const changeStep = (newStep: number) => {
    setStep(Math.max(POST_CREATE_STEPS.ONE, Math.min(newStep, POST_CREATE_STEPS.THREE)));
  };

  return (
    <div className={styles.overlay}>
      {/* 모달 창 닫기 버튼 */}
      <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />

      {/* stage 별 게시글 생성 영역 */}
      <div className={styles.container}>
        <div
          className={`${styles.stepContainer} ${isMounted && step === POST_CREATE_STEPS.ONE ? styles.active : ''}`}
        >
          {step === POST_CREATE_STEPS.ONE && (
            <PostCreateUpload
              nextStep={() => changeStep(POST_CREATE_STEPS.TWO)}
              setPostData={setPostData}
            />
          )}
        </div>

        <div
          className={`${styles.stepContainer} ${step === POST_CREATE_STEPS.TWO ? styles.active : ''}`}
        >
          {step === POST_CREATE_STEPS.TWO && (
            <PostCreateCrop
              nextStep={() => changeStep(POST_CREATE_STEPS.THREE)}
              prevStep={() => changeStep(POST_CREATE_STEPS.ONE)}
              setPostData={setPostData}
              fileUrl={postData.fileUrl}
              userId={user.id}
              username={user.username}
            />
          )}
        </div>

        <div
          className={`${styles.stepContainer} ${step === POST_CREATE_STEPS.THREE ? styles.active : ''}`}
        >
          {step === POST_CREATE_STEPS.THREE && postData.croppedFile && (
            <PostCreateDetails
              prevStep={() => changeStep(POST_CREATE_STEPS.TWO)}
              croppedFile={postData.croppedFile}
              croppedUrl={postData.croppedUrl}
              mediaType={postData.mediaType}
              closeModal={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
