'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import LocationField from '@/components/forms/locationField';
import { CloseButtonBlack } from '@/components/ui/closeButton';
import { ErrorMessage, SuccessMessage } from '@/components/ui/message';
import TextContent from '@/components/ui/textContent';
import { useAuth } from '@/context/authContext';
import { usePost } from '@/context/postContext';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/post/postCreateTextOnly.module.css';
import { apiRequest } from '@/utils/apiRequest';

interface PostCreateTextOnlyProps {
  closeModal: () => void;
}

export default function PostCreateTextOnly({ closeModal }: PostCreateTextOnlyProps) {
  const [postContent, setPostContent] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationOption, setShowLocationOption] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string | null; success: boolean }>({
    message: null,
    success: false,
  });

  const { addPost } = usePost();
  const { logout } = useAuth();

  const handlePostCreate = async () => {
    if (!postContent.trim()) {
      setFeedback({ message: '게시물 내용을 입력해주세요.', success: false });
      return;
    }

    try {
      setIsLoading(true);
      setFeedback({ message: null, success: false });

      const payload = {
        content: postContent.trim(),
        location: location.trim() ? location : null,
      };

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.post(API_ENDPOINTS.POST, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      const newPost = data.body;
      if (!newPost) {
        throw new Error('failed to create a post from the server');
      }

      addPost(data.body);
      setPostContent('');
      setLocation('');
      setFeedback({ message: '게시물이 성공적으로 업로드되었습니다.', success: true });
    } catch (error) {
      console.error('Post Create failed:', error);
      setFeedback({
        message: '게시물 생성 중 오류가 발생했습니다. 다시 시도해 주세요.',
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!feedback.message) {
      return;
    }

    const timer = feedback.success
      ? setTimeout(closeModal, 2000)
      : setTimeout(() => setFeedback({ message: null, success: false }), 3000);
    return () => clearTimeout(timer);
  }, [feedback.message]);

  return (
    <div className={styles.wrapper}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.mobileCloseButtonContainer}>
          <CloseButtonBlack onClick={() => closeModal()} />
        </div>
        <h2 className={styles.title}>게시물 내용 작성</h2>
        <button onClick={handlePostCreate} className={styles.doneButton} disabled={isLoading}>
          공유하기
        </button>
      </div>
      {/* 게시글 내용 수정 */}
      <div className={styles.postContainer}>
        <TextContent textContent={postContent} setTextContent={setPostContent} />
      </div>
      {/* 기타 정보 입력 영역 */}
      {showLocationOption && (
        <div className={styles.postLocation}>
          <div className={styles.postExtrasLabel}>위치 정보 입력</div>
          <LocationField location={location} setLocation={setLocation} />
        </div>
      )}
      {/* 기타 옵션 추가 버튼 */}
      <div className={styles.extraOptions}>
        <span className={styles.extraOptionsText}>게시물에 추가</span>
        <button
          className={styles.extraLocationButton}
          onClick={() => setShowLocationOption((prev) => !prev)}
          title="위치 정보 추가"
        >
          <Image
            className={styles.locationIcon}
            src="/post/location-full.svg"
            alt="Emoji Icon"
            width={18}
            height={20}
          />
        </button>
      </div>
      {/* 메시지 출력 */}
      {feedback.message &&
        (feedback.success ? (
          <SuccessMessage message={feedback.message} className="mb-[16px]" />
        ) : (
          <ErrorMessage message={feedback.message} className="mb-[16px]" />
        ))}
    </div>
  );
}
