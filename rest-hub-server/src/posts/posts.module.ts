import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

import { FollowModule } from '@/follow/follow.module';
import { Post } from '@/model/post.entity';
import { PostLike } from '@/model/postLike.entity';
import { User } from '@/model/user.entity';
import { NotificationsModule } from '@/notifications/notifications.module';
import { PostCommentsModule } from '@/post-comments/post-comments.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, PostLike]),
    UsersModule,
    PostCommentsModule,
    FollowModule,
    NotificationsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
