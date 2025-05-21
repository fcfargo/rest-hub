import classNames from 'classnames';
import Image from 'next/image';

import { MEDIA_TYPES } from '@/constants';
import styles from '@/styles/media/mediaPreview.module.css';
import { MediaTypes } from '@/types';

interface PostMediaPreviewProps {
  url: string;
  mediaType: MediaTypes;
}

interface PostMediaViewerProps {
  url: string;
  mediaType: MediaTypes;
  className?: MediaTypes;
}

export function PostCreateMediaPreview({ url, mediaType }: PostMediaPreviewProps) {
  return (
    <div className={styles.postCreateMediaPreviewContainer}>
      {mediaType.startsWith(MEDIA_TYPES.IMAGE) ? (
        <Image style={{ objectFit: 'contain' }} src={url} alt="Image Preview" fill priority />
      ) : (
        <video className={styles.previewVideo} src={url} controls />
      )}
    </div>
  );
}

export function PostItemMediaViewer({ url, mediaType, className }: PostMediaViewerProps) {
  return (
    <div className={classNames(styles.postItemMediaViewerContainer, className)}>
      {mediaType.startsWith(MEDIA_TYPES.IMAGE) ? (
        <Image
          src={url}
          alt="Post Image"
          priority
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 400px"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: 'auto',
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export function PostDetailMediaViewer({ url, mediaType, className }: PostMediaViewerProps) {
  return (
    <div className={classNames(styles.postDetailMediaViewerContainer, className)}>
      {mediaType.startsWith(MEDIA_TYPES.IMAGE) ? (
        <Image
          src={url}
          alt="Post Image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{
            objectFit: 'contain',
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
}
