import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository, UpdateResult } from 'typeorm';

import {
  CreateNotificationRequest,
  NOTIFICATION_TYPES,
  NotificationWithViewerState,
  UpdateNotificationMarkRequest,
} from './interfaces/notification.interface';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { Notification } from '@/model/notification.entity';
import { User } from '@/model/user.entity';

@Injectable()
export class NotificationRepository {
  private readonly notification = Notification;
  private readonly user = User;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(
    requestData: CreateNotificationRequest,
    manager?: EntityManager,
  ): Promise<Notification> {
    const repo = manager ? manager.getRepository(this.notification) : this.notificationRepository;
    const notification = repo.create(requestData);
    return repo.save(notification);
  }

  async isDuplicateFollowNotification(
    userId: number,
    actorId: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo = manager ? manager.getRepository(this.notification) : this.notificationRepository;

    const existing = await repo.findOne({
      where: {
        userId,
        actorId,
        type: NOTIFICATION_TYPES.FOLLOW,
      },
    });

    return !!existing;
  }

  async isDuplicateLikeNotification(
    userId: number,
    actorId: number,
    postId: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo = manager ? manager.getRepository(this.notification) : this.notificationRepository;

    const existing = await repo.findOne({
      where: {
        userId,
        actorId,
        type: NOTIFICATION_TYPES.LIKE,
        postId,
      },
    });

    return !!existing;
  }

  async getPaginatedUserNotifications(
    userId: number,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<{ notifications: NotificationWithViewerState[]; totalCount: number }> {
    const addSelectColumnName = 'isFollowing';

    const qb = this.notificationRepository
      .createQueryBuilder('notification')
      // 1. actor 유저 정보 조인
      .leftJoinAndMapOne(
        'notification.actor',
        this.user,
        'actor',
        'actor.id = notification.actorId',
      )
      // 2. actor가 나를 팔로우 중인지 확인
      .leftJoin(
        'user_follows',
        'follow',
        'follow.followingId = notification.actorId AND follow.followerId = :userId',
        { userId },
      )

      // 3. 팔로우 여부 판단용 필드 가져오기
      .addSelect('follow.id', addSelectColumnName)

      // 4. 나에게 온 알림만
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', order)
      .skip(offset)
      .take(limit);

    // 알림 목록 + isFollowing 여부
    const { entities, raw } = await qb.getRawAndEntities();

    const notifications = entities.map((notification, index) => ({
      ...notification,
      isFollowing: !!raw[index][addSelectColumnName],
    }));

    // 총 개수 별도 쿼리
    const totalCount = await this.notificationRepository.count({
      where: { userId },
    });

    return {
      notifications,
      totalCount,
    };
  }

  async updateNotificationMarkAsReadByIdAndUserId(
    userId: number,
    notificationId: number,
    updateData: UpdateNotificationMarkRequest,
  ): Promise<UpdateResult> {
    return this.notificationRepository.update(
      { id: notificationId, userId },
      { ...updateData, readAt: new Date() },
    );
  }

  async deleteNotificationByIdAndUserId(
    userId: number,
    notificationId: number,
  ): Promise<DeleteResult> {
    return this.notificationRepository.delete({ id: notificationId, userId });
  }
}
