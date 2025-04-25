import { MetaDataResponseDto } from '@/common/dtos/common.response.dto';
import { Notification } from '@/model/notification.entity';

export const NOTIFICATION_TYPES = {
  LIKE: 'LIKE',
  FOLLOW: 'FOLLOW',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export interface GetPaginatedNotificationsResponse {
  notifications: NotificationWithViewerState[];
  meta: MetaDataResponseDto;
}

export interface CreateNotificationRequest {
  userId: number;
  type: NotificationType;
  actorId?: number;
  postId?: string;
  message?: string;
}

export interface CreateFollowNotificationRequest {
  userId: number;
  type: NotificationType;
  actorId: number;
}

export interface CreateLikeNotificationRequest {
  userId: number;
  type: NotificationType;
  actorId: number;
  postId: string;
}

export interface UpdateNotificationMarkRequest {
  isRead: boolean;
}

export type NotificationWithViewerState = Notification & {
  isFollowing: boolean;
};
