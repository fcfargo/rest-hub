import { MEDIA_TYPES, NOTIFICATION_TYPES } from '@/constants';

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
  isFollowing: boolean;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profileImage: string | null;
  deviceToken: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  socialProvider: string | null;
  followingsCount: number;
  followersCount: number;
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
    commentsCount: number;
  };
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
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

export type TextValueUpdater = string | ((prev: string) => string);

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type Notification = {
  id: string;
  userId: number;
  type: NotificationType;
  actor: {
    id: number;
    username: string;
    profileImage: string | null;
  };
  postId: string | null;
  message: string;
  isRead: boolean;
  isFollowing: boolean;
  createdAt: Date;
};
