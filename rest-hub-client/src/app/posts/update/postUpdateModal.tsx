'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import LocationField from '@/components/forms/locationField';
import { CloseButtonWhite } from '@/components/ui/closeButton';
import { ErrorMessage } from '@/components/ui/message';
import TextContent from '@/components/ui/textContent';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import modalStyles from '@/styles/posts/postCreateModal.module.css';
import updateStyles from '@/styles/posts/postUpdateModal.module.css';
import { Post } from '@/types';

interface PostUpdateModalProps {
  post: Post;
}

export default function PostUpdateModal({ post }: PostUpdateModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [postContent, setPostContent] = useState(post.content);
  const [location, setLocation] = useState('');
  const [showLocationOption, setShowLocationOption] = useState(false);

  const { closeModal } = useModal();

  const isMounted = useMounted();

  const handlePostUpdate = async () => {
    console.log('handlePostUdpate');
  };

  return (
    <div className={modalStyles.overlay}>
      {/* 모달 창 닫기 버튼 */}
      <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />

      <div className={updateStyles.container}>
        <div className={classNames(updateStyles.wrapper, isMounted ? updateStyles.active : '')}>
          {/* 헤더 */}
          <div className={updateStyles.header}>
            <h2 className={modalStyles.title}>게시물 수정하기</h2>
            <button onClick={handlePostUpdate} className={updateStyles.doneButton}>
              공유하기
            </button>
          </div>
          {/* 게시글 수정 */}
          <div className={updateStyles.postContainer}>
            <TextContent textContent={postContent} setTextContent={setPostContent} />
          </div>

          {/* 기타 옵션 입력 영역 */}
          {showLocationOption && (
            <div className={updateStyles.postLocation}>
              <div className={updateStyles.postExtrasLabel}>위치 정보 입력</div>
              <LocationField location={location} setLocation={setLocation} />
            </div>
          )}

          {/* 기타 옵션 토글 버튼 */}
          <div className={updateStyles.extraOptions}>
            <span className={updateStyles.extraOptionsText}>게시물에 추가</span>
            <button
              className={updateStyles.extraLocationButton}
              onClick={() => setShowLocationOption((prev) => !prev)}
              title="위치 정보 추가"
            >
              <Image
                className={updateStyles.locationIcon}
                src="/posts/location-red.svg"
                alt="Emoji Icon"
                width={18}
                height={20}
              />
            </button>
          </div>

          {/* 에러 메시지 출력 */}
          {message && <ErrorMessage message={message} />}
        </div>
      </div>
    </div>
  );
}
