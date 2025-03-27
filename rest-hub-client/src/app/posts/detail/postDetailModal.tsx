'use client';

import classNames from 'classnames';

import { PostMediaViewer } from '@/components/media/mediaPreview';
import { CloseButtonWhite } from '@/components/ui/closeButton';
import { MEDIA_TYPES } from '@/constants';
import { useModal } from '@/context/modalContext';
import { useMounted } from '@/hooks/useMounted';
import styles from '@/styles/posts/postDetail.module.css';
import { Post } from '@/types';

interface PostDetailModalProps {
  post: Post;
}

export default function PostDetailModal({ post }: PostDetailModalProps) {
  const isMounted = useMounted();
  const { closeModal } = useModal();

  const { imageUrl } = post;

  return (
    <div className={styles.overlay}>
      <CloseButtonWhite onClick={() => closeModal()} className="mt-[16px] mr-[16px]" />

      <div className={styles.container}>
        <div
          className={classNames(
            styles.wrapper,
            isMounted && styles.active,
            imageUrl && styles.withMedia,
          )}
        >
          {/* 헤더 */}
          <div className={styles.header}>
            <h2 className={styles.title}>게시물 상세보기</h2>
          </div>

          <div className={styles.body}>
            {imageUrl && (
              <div className={styles.mediaContentSection}>
                <PostMediaViewer
                  url={imageUrl}
                  mediaType={MEDIA_TYPES.IMAGE}
                  className="shadow-2xl"
                />
              </div>
            )}
            <div className={styles.extraContentSection}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
