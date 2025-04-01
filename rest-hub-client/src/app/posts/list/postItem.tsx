'use client';

import PostActionBarSection from '../detail/sections/PostActionBarSection';
import PostContentSection from '../detail/sections/PostContentSection';
import PostProfileSection from '../detail/sections/PostProfileSection';

import { PostItemMediaViewer } from '@/components/media/mediaPreview';
import { MEDIA_TYPES, MODAL_TYPES } from '@/constants';
import { useModal } from '@/context/modalContext';
import styles from '@/styles/posts/postItem.module.css';
import { Post } from '@/types';

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const { openModal } = useModal();

  const { id, content, imageUrl, likesCount, commentsCount, isLiked } = post;

  // 게시글에 미디어 데이터 포함됐는지 여부
  const hasMediaData = Boolean(imageUrl?.trim());

  /** 이미지 클릭 처리 */
  const handleOpenImageModal = async () => {
    openModal(MODAL_TYPES.POST_DETAIL, { post });
    return;
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 게시글 작성 유저 정보 */}
        <div className={styles.postProfileContainer}>
          <PostProfileSection post={post} />
        </div>

        {/* 게시글 내용 */}
        <div className={styles.postContentContainer}>
          <PostContentSection
            content={content}
            hasMediaData={hasMediaData}
            showToggleButton={true}
          />
        </div>

        {/* 게시글 이미지(여러 장 처리 로직은 추후 추가 예정 */}
        {imageUrl?.trim() && (
          <div className={styles.mediaContainer}>
            <button type="button" onClick={handleOpenImageModal} className={styles.mediaButton}>
              {/* 후속 작업
               * 1) 이미지 어려 개 업로드
               * 2) .gif 파일 업로드
               * 3) 비디오 파일 업로드
               * 현재는 이미지 파일만 처리하기 때문에, mediaType을 고정값으로 넘겨주고 있지만
               * 나중에 mediaType 정보를 DB에서 받아서 넘겨주도록 수정 예정
               */}
              <PostItemMediaViewer
                url={imageUrl}
                className="rounded-lg"
                mediaType={MEDIA_TYPES.IMAGE}
              />
            </button>
          </div>
        )}

        {/* 게시글 좋아요 및 댓글 정보 */}
        <div className={styles.postActionBarContainer}>
          <PostActionBarSection
            postId={id}
            likesCount={likesCount}
            commentsCount={commentsCount}
            isLiked={isLiked}
          />
        </div>
      </div>
    </div>
  );
}
