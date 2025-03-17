'use client';

import classNames from 'classnames';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import MediaPreview from '@/components/media/mediaPreview';
import { CloseButtonBlack } from '@/components/ui/closeButton';
import { ErrorMessage, SuccessMessage } from '@/components/ui/message';
import { INPUT_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { usePlacesAutocomplete } from '@/hooks/usePlacesAutocomplete';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import { uploadImageToS3 } from '@/libs/upload';
import detailsStyles from '@/styles/posts/postCreateDetails.module.css';
import modalStyles from '@/styles/posts/postCreateModal.module.css';
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
  const [showPicker, setShowPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { logout } = useAuth();
  const { suggestions, loading } = usePlacesAutocomplete(location);

  const pickerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  /** 이모지 추가 */
  const addEmoji = useCallback((emojiObject: { emoji: string }) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  }, []);

  /** 게시글 작성 */
  const handleTextWrite = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  }, []);

  /** 위치 입력 */
  const handleLocationInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  }, []);

  /** 위치 선택 */
  const handleSelectLocation = useCallback((place: string) => {
    setLocation(place);
  }, []);

  /**  게시글 업로드 */
  const handlePostCreate = useCallback(async () => {
    if (!croppedFile) {
      setMessage('이미지가 필요합니다.');
      return;
    }

    if (!postContent.trim()) {
      setMessage('게시물 내용을 입력해야 합니다.');
      return;
    }

    try {
      const imageUrl = await uploadImageToS3(croppedFile, logout);

      const formData = {
        imageUrl,
        content: postContent.trim(),
        location: location.trim() ? location : null,
      };

      const { data } = await apiRequest(async (accessToken: string) => {
        return api.post(API_ENDPOINTS.POST_CREATE, formData, {
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

  /** 외부 클릭 감지하여 이모지 & 추천 리스트 닫기 */
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* 미디어 미리보기 & 게시글 작성  */}
      <div className={detailsStyles.postDetailsContainer}>
        <MediaPreview preview={croppedUrl} mediaType={mediaType} />

        <div className={detailsStyles.postInfo}>
          {/* 게시물 입력 */}
          <div className={detailsStyles.postContent}>
            <textarea
              className={detailsStyles.postContentText}
              value={postContent}
              onChange={handleTextWrite}
              placeholder="Write a post..."
              maxLength={2200}
            />

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
              <div
                ref={pickerRef}
                className={classNames(
                  detailsStyles.emojiPickerContainer,
                  showPicker && detailsStyles.active,
                )}
              >
                <EmojiPicker
                  searchDisabled={true}
                  width={300}
                  height={360}
                  onEmojiClick={addEmoji}
                />
              </div>

              {/* 글자 수 표시 */}
              <div className={detailsStyles.contentLength}>{postContent.length}/2200</div>
            </div>
          </div>

          {/*  위치 입력*/}
          <div className={detailsStyles.postMeta}>
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
