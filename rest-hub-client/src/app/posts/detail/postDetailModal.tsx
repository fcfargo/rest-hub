'use client';

import classNames from 'classnames';
import { useEffect, useState } from 'react';

import CommentSection from './\bcomment/CommentSection';
import PostContentSection from './sections/PostContentSection';
import PostDetailMediaSection from './sections/PostDetailMediaSection';
import PostProfileSection from './sections/PostProfileSection';

import { CloseButtonBlack, CloseButtonWhite } from '@/components/ui/closeButton';
import { MEDIA_TYPES } from '@/constants';
import { useAuth } from '@/context/authContext';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { useIsTabletOrMobile } from '@/hooks/useIsDesktop';
import { useMounted } from '@/hooks/useMounted';
import { API_ENDPOINTS } from '@/libs/api';
import api from '@/libs/axiosInstance';
import styles from '@/styles/post/postDetail.module.css';
import { Post } from '@/types';
import { apiRequest } from '@/utils/apiRequest';

interface PostDetailModalProps {
  postId: string;
}

export default function PostDetailModal({ postId }: PostDetailModalProps) {
  const isMounted = useMounted();
  const { closeModal } = useModal();
  const { posts } = usePost();
  const { logout } = useAuth();
  const isTabletOrMobile = useIsTabletOrMobile();

  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const existingPost = posts.find((p) => p.id === postId);

        if (existingPost) {
          setPost(existingPost);
        } else {
          const { data } = await apiRequest(async (accessToken: string) => {
            return api.get(`${API_ENDPOINTS.POST}/${postId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          }, logout);
          setPost(data.body);
        }
      } catch (error) {
        console.error('Failed to get post:', error);
        closeModal();
      }
    }

    fetchPost();
  }, [postId, posts, closeModal]);

  if (!post) {
    return null;
  }

  const { imageUrl, content } = post;
  const hasMediaData = Boolean(imageUrl?.trim());

  return (
    <div className={styles.overlay}>
      {!isTabletOrMobile && (
        <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />
      )}

      <div className={styles.container}>
        <div
          className={classNames(
            styles.wrapper,
            isMounted && styles.active,
            hasMediaData && styles.withMedia,
          )}
        >
          {/* 헤더 */}
          <div className={styles.header}>
            <h2 className={styles.title}>게시물 상세보기</h2>
            <div className={styles.mobileCloseButtonContainer}>
              <CloseButtonBlack onClick={() => closeModal()} />
            </div>
          </div>

          <div className={styles.body}>
            {/* 게시글 미디어 파일 정보 */}
            {hasMediaData && imageUrl && (
              <div className={styles.mediaContentsSection}>
                <PostDetailMediaSection
                  url={imageUrl}
                  mediaType={MEDIA_TYPES.IMAGE}
                  className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] rounded-xl"
                />
              </div>
            )}

            <div
              className={
                hasMediaData ? styles.extraContentsSectionWithMedia : styles.extraContentsSection
              }
            >
              {/* 게시글 작성 유저 정보 */}
              <div className={styles.postProfileContainer}>
                <PostProfileSection post={post} />
              </div>

              {/* 게시글 내용 및 댓글 정보 */}
              <div className={styles.postBodyContainer}>
                <CommentSection post={post}>
                  <PostContentSection
                    content={content}
                    hasMediaData={hasMediaData}
                    showToggleButton={false}
                  />
                </CommentSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
