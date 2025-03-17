import { MEDIA_TYPES } from '@/constants';

export type Post = {
  id: number;
  content: number;
  imageUrl?: string;
  location?: string;
  likeCount: number;
  user: {
    id: number;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profileImage: string | null;
  deviceToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  socialProvider: string | null;
};

export interface PostDataProps {
  media: File | null;
  mediaType: MediaTypes;
  caption: string;
  fileUrl: string;
  croppedFile: File | null;
  croppedUrl: string;
}

export type MediaTypes = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];
