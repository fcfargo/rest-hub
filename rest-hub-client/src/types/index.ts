import { MEDIA_TYPES } from '@/constants';

export type Post = {
  id: string;
  content: string;
  imageUrl: string | null;
  location: string | null;
  likesCount: number;
  commentsCount: number;
  user: {
    id: number;
    username: string;
    profileImage: string | null;
  };
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
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

export type Comment = {
  id: string;
  content: string;
  parentId: string | null;
  user: {
    id: number;
    username: string;
    profileImage: string | null;
  };
  post: {
    id: string;
  };
  children?: Comment[];
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
