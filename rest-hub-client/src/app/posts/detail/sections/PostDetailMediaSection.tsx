'use client';

import { PostDetailMediaViewer } from '@/components/media/mediaPreview';
import { MediaTypes } from '@/types';

interface PostDetailMediaSectionProps {
  url: string;
  mediaType: MediaTypes;
  className?: string;
}

export default function PostDetailMediaSection({
  url,
  mediaType,
  className,
}: PostDetailMediaSectionProps) {
  if (!url || !mediaType) {
    return null;
  }

  return <PostDetailMediaViewer url={url} mediaType={mediaType} className={className} />;
}
