'use client';

import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { MediaTypes } from '../postCreateModal';
import MediaPreview from '@/components/media/mediaPreview';
import { CloseButtonBlack } from '@/components/ui/closeButton';
import { ErrorMessage, SuccessMessage } from '@/components/ui/message';
import { INPUT_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import detailsStyles from '@/styles/posts/postCreateDetails.module.css';
import modalStyles from '@/styles/posts/postCreateModal.module.css';
import { getAccessToken } from '@/utils/authUtils';

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
  const [message, setMessage] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { logout } = useAuth();

  const { suggestions, loading } = usePlacesAutocomplete(location);

  const pickerRef = useRef<HTMLDivElement>(null);

  const suggestionsRef = useRef<HTMLUListElement>(null);

  const addEmoji = (emojiObject: { emoji: string }) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }

      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTextWrite = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSelectLocation = (place: string) => {
    setLocation(place);
  };

  const handlePostCreate = async () => {
    if (!croppedFile) {
      setMessage('이미지가 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('image', croppedFile);
    formData.append('content', postContent);
    formData.append('location', location);

    const accessToken = getAccessToken();
    if (!accessToken) {
      logout();
      return;
    }

    try {
      const { data } = await api.post(API_ENDPOINTS.POST_CREATE, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!data.body) {
        throw new Error('failed to create a post from the server');
      }

      setPostContent('');
      setLocation('');
      setMessage('게시물이 성공적으로 업로드되었습니다.');
      setIsSuccess(true);

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Post Create failed:', error);
      setMessage('게시물 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className={detailsStyles.wrapper}>
      {/* 헤더 */}
      <div className={modalStyles.header}>
        <button onClick={prevStep} className={modalStyles.backButton}>
          <Image
            className={modalStyles.backButtonIcon}
            src="/posts/arrow-back.svg"
            alt="Back Button Icon"
            width={24}
            height={24}
          />
        </button>
        <h2 className={modalStyles.title}>게시물 내용 작성</h2>
        <button onClick={handlePostCreate} className={modalStyles.doneButton}>
          공유하기
        </button>
      </div>
      <div className={detailsStyles.postDetailsContainer}>
        {/* 미디어 미리보기  */}
        <MediaPreview preview={croppedUrl} mediaType={mediaType} />

        {/* 게시물 정보 입력 */}
        <div className={detailsStyles.postInfo}>
          <div className={detailsStyles.postContent}>
            {/*  게시글 입력 필드 */}
            <textarea
              className={detailsStyles.postContentText}
              value={postContent}
              onChange={handleTextWrite}
              placeholder="Write a post..."
              maxLength={2200}
            />

            {/*  게시글 하단 UI */}
            <div className={detailsStyles.postContentFooter}>
              {/* 이모지 버튼 */}
              <button
                onClick={() => setShowPicker((prev) => !prev)}
                className={modalStyles.emojiButton}
              >
                <Image
                  className={detailsStyles.emojiIcon}
                  src="/posts/emoji.svg"
                  alt="Emoji Icon"
                  width={20}
                  height={20}
                />
              </button>

              {/* ✨ 이모지 피커 */}
              {showPicker && (
                <div ref={pickerRef} className={detailsStyles.emojiPickerContainer}>
                  <EmojiPicker
                    searchDisabled={true}
                    width={300}
                    height={360}
                    onEmojiClick={addEmoji}
                  />
                </div>
              )}

              {/* 글자 수 표시 */}
              <div className={detailsStyles.contentLength}>{postContent.length}/2200</div>
            </div>
          </div>
          <div className={detailsStyles.postMeta}>
            {/*  게시글 위치 정보 추가*/}
            <div className={detailsStyles.locationContainer}>
              <input
                className={detailsStyles.locationInput}
                type={INPUT_TYPES.TEXT}
                value={location}
                placeholder="Add location"
                onChange={handleLocationInput}
                onFocus={() => setShowSuggestions(true)}
              />

              {location ? (
                <CloseButtonBlack
                  className={detailsStyles.closeButton}
                  onClick={() => setLocation('')}
                />
              ) : (
                <Image
                  className={detailsStyles.locationIcon}
                  src="/posts/location.svg"
                  alt="Location Icon"
                  width={18}
                  height={18}
                />
              )}

              {/* 자동완성된 주소 목록 표시 */}
              {location && showSuggestions && (
                <ul ref={suggestionsRef} className={detailsStyles.suggestionsList}>
                  {loading ? (
                    <Image
                      className={detailsStyles.loadingIcon}
                      src="/posts/loading.gif"
                      alt="Location loading Icon"
                      width={24}
                      height={24}
                    />
                  ) : (
                    suggestions.length > 0 &&
                    suggestions.map((place) => (
                      <li
                        key={place.placeId}
                        className={detailsStyles.suggestionItem}
                        onClick={() => handleSelectLocation(place.description)}
                      >
                        {place.description}
                      </li>
                    ))
                  )}
                </ul>
              )}
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
