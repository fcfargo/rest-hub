import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsController } from './notifications.controller';
import { NotificationRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';

import { Notification } from '@/model/notification.entity';
import { User } from '@/model/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
