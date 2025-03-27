'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import LocationField from '@/components/forms/locationField';
import { PostMediaPreview } from '@/components/media/mediaPreview';
import { ErrorMessage, SuccessMessage } from '@/components/ui/message';
import TextContent from '@/components/ui/textContent';
import { MEDIA_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { uploadMediaToS3 } from '@/libs/upload';
import styles from '@/styles/posts/postCreateDetails.module.css';
import { MediaTypes } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

interface PostCreateDetailsProps {
  prevStep: () => void;
  croppedFile: File;
  croppedUrl: string;
  mediaType: MediaTypes;
  closeModal: () => void;
}

export default function PostCreateDetails({
  prevStep,
  croppedFile,
  croppedUrl,
  mediaType,
  closeModal,
}: PostCreateDetailsProps) {
  const [postContent, setPostContent] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { logout } = useAuth();

  /**  게시글 업로드 */
  const handlePostCreate = useCallback(async () => {
    if (!croppedFile) {
      setMessage('미디어 파일이 필요합니다.');
      return;
    }

    if (!postContent.trim()) {
      setMessage('게시물 내용을 입력해야 합니다.');
      return;
    }

    try {
      const imageUrl =
        mediaType === MEDIA_TYPES.IMAGE ? await uploadMediaToS3(croppedFile, logout) : null;

      const formData = {
        imageUrl,
        content: postContent.trim(),
        location: location.trim() ? location : null,
      };

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.post(API_ENDPOINTS.POST, formData, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      if (!data.body) {
        throw new Error('failed to create a post from the server');
      }

      setPostContent('');
      setLocation('');
      setMessage('게시물이 성공적으로 업로드되었습니다.');
      setIsSuccess(true);

      setTimeout(closeModal, 2000);
    } catch (error) {
      console.error('Post Create failed:', error);
      setMessage('게시물 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }, [croppedFile, postContent, location, closeModal, logout]);

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button onClick={prevStep} className={styles.backButton}>
          <Image
            className={styles.backButtonIcon}
            src="/posts/arrow-back.svg"
            alt="Back Button Icon"
            priority
            width={24}
            height={24}
          />
        </button>
        <h2 className={styles.title}>게시물 내용 작성</h2>
        <button onClick={handlePostCreate} className={styles.doneButton}>
          공유하기
        </button>
      </div>
      {/* 미디어 미리보기 & 게시글 작성  */}
      <div className={styles.postDetailsContainer}>
        <PostMediaPreview url={croppedUrl} mediaType={mediaType} />

        <div className={styles.postInfo}>
          {/* 게시물 입력 */}
          <div className={styles.postContentContainer}>
            <TextContent textContent={postContent} setTextContent={setPostContent} />
          </div>

          {/* 기타 정보 입력 */}
          <div className={styles.postMeta}>
            {/*  위치  정보 입력*/}
            <div className={styles.postLocation}>
              <LocationField location={location} setLocation={setLocation} />
            </div>
          </div>
        </div>
      </div>
      {/* 메시지 출력 */}
      {message &&
        (isSuccess ? (
          <SuccessMessage message={message} />
        ) : (
          <ErrorMessage message={message} />
        ))}{' '}
    </div>
  );
}
