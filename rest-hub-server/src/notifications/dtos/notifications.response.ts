import { Expose, Type } from 'class-transformer';

import { NotificationType } from '../interfaces/notification.interface';

import { MetaDataResponseDto } from '@/common/dtos/common.response.dto';

export class NotificationActorResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  profileImage: string;
}

export class NotificationResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: number;

  @Expose()
  type: NotificationType;

  @Expose()
  @Type(() => NotificationActorResponseDto)
  actor: NotificationActorResponseDto;

  @Expose()
  postId: string;

  @Expose()
  message: string;

  @Expose()
  isRead: boolean;

  @Expose()
  isFollowing: boolean;

  @Expose()
  createdAt: boolean;
}

export class GetPaginatedUserNotificationsResponseDto {
  @Expose()
  @Type(() => NotificationResponseDto)
  notifications: NotificationResponseDto[];

  @Expose()
  meta: MetaDataResponseDto;
}
