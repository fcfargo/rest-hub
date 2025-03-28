'use client';

import { PostDetailMediaViewer } from '@/components/media/mediaPreview';

interface PostDetailMediaSectionProps {
  url: string;
  mediaType: string;
}

export default function PostDetailMediaSection({ url, mediaType }: PostDetailMediaSectionProps) {
  if (!url) {
    return null;
  }

  return <PostDetailMediaViewer url={url} mediaType={mediaType} className="shadow-2xl" />;
}
