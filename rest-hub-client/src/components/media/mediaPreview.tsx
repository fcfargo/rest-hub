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
  mediaType: string;
  className?: MediaTypes;
}

export function PostMediaPreview({ url, mediaType }: PostMediaPreviewProps) {
  return (
    <div className={styles.mediaPreviewContainer}>
      {mediaType.startsWith(MEDIA_TYPES.IMAGE) ? (
        <Image style={{ objectFit: 'contain' }} src={url} alt="Image Preview" fill priority />
      ) : (
        <video className={styles.previewVideo} src={url} controls />
      )}
    </div>
  );
}

export function PostMediaViewer({ url, mediaType, className }: PostMediaViewerProps) {
  return (
    <div className={classNames(styles.mediaViewerContainer, className)}>
      {mediaType.startsWith(MEDIA_TYPES.IMAGE) ? (
        <Image
          src={url}
          alt="Post Image"
          priority
          width={0}
          height={0}
          sizes="100vw"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: 'auto',
            display: 'flex',
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
}
