import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FollowController } from './follow.controller';
import { FollowRepository } from './follow.repository';
import { FollowService } from './follow.service';

import { QueueModule } from '@/common/queue/queue.module';
import { Follow } from '@/model/follow.entity';
import { User } from '@/model/user.entity';
import { NotificationsModule } from '@/notifications/notifications.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Follow]),
    UsersModule,
    NotificationsModule,
    QueueModule,
  ],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports: [FollowService],
})
export class FollowModule {}
