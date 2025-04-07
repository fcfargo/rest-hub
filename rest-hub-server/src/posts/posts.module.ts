import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

import { Post } from '@/model/post.entity';
import { PostLike } from '@/model/postLike.entity';
import { User } from '@/model/user.entity';
import { PostCommentsModule } from '@/post-comments/post-comments.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, PostLike]), UsersModule, PostCommentsModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
