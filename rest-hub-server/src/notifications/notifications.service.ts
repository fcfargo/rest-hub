import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { GetNotificationsRequestDto } from './dtos/notifications.dto';
import {
  CreateFollowNotificationRequest,
  CreateLikeNotificationRequest,
  GetPaginatedNotificationsResponse,
  NOTIFICATION_TYPES,
  UpdateNotificationMarkRequest,
} from './interfaces/notification.interface';
import { NotificationRepository } from './notifications.repository';

import { NOTIFICATION_MESSAGES_KO, ORDER_TYPES } from '@/common/constants';
import { CommonMessageResponseDto } from '@/common/dtos/common.response.dto';
import { Notification } from '@/model/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async createFollowNotification(
    requestData: CreateFollowNotificationRequest,
    manager?: EntityManager,
  ): Promise<Notification> {
    const { type } = requestData;

    if (type !== NOTIFICATION_TYPES.FOLLOW) {
      throw new BadRequestException('Invalid notification type for follow action');
    }

    const message = NOTIFICATION_MESSAGES_KO.FOLLOW;

    return this.notificationRepository.createNotification({ ...requestData, message }, manager);
  }

  async isDuplicateFollowNotification(
    userId: number,
    actorId: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.notificationRepository.isDuplicateFollowNotification(userId, actorId, manager);
  }

  async createLikeNotification(
    requestData: CreateLikeNotificationRequest,
    manager?: EntityManager,
  ): Promise<Notification> {
    const { type } = requestData;

    if (type !== NOTIFICATION_TYPES.LIKE) {
      throw new BadRequestException('Invalid notification type for like action');
    }

    const message = NOTIFICATION_MESSAGES_KO.LIKE;

    return this.notificationRepository.createNotification({ ...requestData, message }, manager);
  }

  async isDuplicateLikeNotification(
    userId: number,
    actorId: number,
    postId: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    return this.notificationRepository.isDuplicateLikeNotification(
      userId,
      actorId,
      postId,
      manager,
    );
  }

  async getPaginatedUserNotifications(
    userId: number,
    query: GetNotificationsRequestDto,
  ): Promise<GetPaginatedNotificationsResponse> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const order = ORDER_TYPES.DESC;

    const { notifications, totalCount } =
      await this.notificationRepository.getPaginatedUserNotifications(userId, limit, offset, order);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      notifications,
      meta: {
        totalPages,
        currentPage: page,
      },
    };
  }

  async markAsRead(
    userId: number,
    notificationId: number,
    requestData: UpdateNotificationMarkRequest,
  ): Promise<CommonMessageResponseDto> {
    const result = await this.notificationRepository.updateNotificationMarkAsReadByIdAndUserId(
      userId,
      notificationId,
      requestData,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Notification does not exist or does not belong to the user');
    }

    return { message: 'Notification updated successfully' };
  }

  async deleteNotification(
    userId: number,
    notificationId: number,
  ): Promise<CommonMessageResponseDto> {
    const result = await this.notificationRepository.deleteNotificationByIdAndUserId(
      userId,
      notificationId,
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        'Notification does not exist or you do not have permission to delete it',
      );
    }

    return { message: 'Notification deleted successfully' };
  }
}
