import Image from 'next/image';

import { MEDIA_TYPES } from '@/constants';
import styles from '@/styles/media/mediaPreview.module.css';

interface MediaPreviewProps {
  preview: string;
  mediaType: string;
}

export default function MediaPreview({ preview, mediaType }: MediaPreviewProps) {
  return (
    <div className={styles.mediaWrapper}>
      {mediaType.startsWith(MEDIA_TYPES.IMAGE) ? (
        <Image
          className={styles.previewImage}
          src={preview}
          alt="Image Preview"
          fill
          objectFit="cover"
          priority
        />
      ) : (
        <video className={styles.previewVideo} src={preview} controls />
      )}
    </div>
  );
}
