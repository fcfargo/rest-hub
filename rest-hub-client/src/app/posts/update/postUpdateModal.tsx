'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import LocationField from '@/components/forms/locationField';
import { CloseButtonBlack, CloseButtonWhite } from '@/components/ui/closeButton';
import { ErrorMessage } from '@/components/ui/message';
import TextContent from '@/components/ui/textContent';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { useIsTabletOrMobile } from '@/hooks/useIsDesktop';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/post/postUpdate.module.css';
import { Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

interface PostUpdateModalProps {
  post: Post;
}

export default function PostUpdateModal({ post }: PostUpdateModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [postContent, setPostContent] = useState(post.content);
  const [location, setLocation] = useState(post.location || '');
  const [showLocationOption, setShowLocationOption] = useState(Boolean(post.location?.trim()));
  const [isLoading, setIsLoading] = useState(false);

  const { closeModal } = useModal();
  const { patchPost } = usePost();
  const isMounted = useMounted();
  const { logout } = useAuth();
  const isTabletOrMobile = useIsTabletOrMobile();

  /**
   * 게시글 수정 요청 처리
   */
  const handlePostUpdate = async () => {
    if (!postContent.trim()) {
      setMessage('게시물 내용을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const payload = {
        content: postContent,
        location: showLocationOption ? location : null,
      };

      const postId = post.id;

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.patch(`${API_ENDPOINTS.POST}/${postId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }, logout);

      closeModal();
      patchPost(postId, data.body);
    } catch (error) {
      console.error('Failed to update post:', error);
      setMessage('게시글 수정 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      {!isTabletOrMobile && (
        <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />
      )}

      <div className={styles.container}>
        <div className={classNames(styles.wrapper, isMounted && styles.active)}>
          {/* 헤더 */}
          <div className={styles.header}>
            <div className={styles.mobileCloseButtonContainer}>
              <CloseButtonBlack onClick={() => closeModal()} />
            </div>
            <h2 className={styles.title}>게시물 수정하기</h2>
            <button onClick={handlePostUpdate} className={styles.doneButton} disabled={isLoading}>
              수정 완료
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
          {message && <ErrorMessage message={message} className="mb-[16px]" />}
        </div>
      </div>
    </div>
  );
}
