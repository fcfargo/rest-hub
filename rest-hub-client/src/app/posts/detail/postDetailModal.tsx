'use client';

import classNames from 'classnames';

import CommentSection from './\bcomment/CommentSection';
import PostContentSection from './sections/PostContentSection';
import PostDetailMediaSection from './sections/PostDetailMediaSection';
import PostProfileSection from './sections/PostProfileSection';

import { CloseButtonWhite } from '@/components/ui/closeButton';
import { MEDIA_TYPES } from '@/constants';
import { useModal } from '@/context/modalContext';
import { usePost } from '@/context/postContext';
import { useMounted } from '@/hooks/useMounted';
import styles from '@/styles/post/postDetail.module.css';

interface PostDetailModalProps {
  postId: string;
}

export default function PostDetailModal({ postId }: PostDetailModalProps) {
  const isMounted = useMounted();
  const { closeModal } = useModal();
  const { posts } = usePost();

  const post = posts.find((p) => p.id === postId);

  if (!post || !postId) {
    return null;
  }

  const { id, imageUrl, content } = post;

  // 게시글에 미디어 데이터 포함 여부
  const hasMediaData = Boolean(imageUrl?.trim());

  return (
    <div className={styles.overlay}>
      <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />

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
