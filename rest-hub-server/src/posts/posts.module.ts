import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

import { Post } from '@/model/post.entity';
import { User } from '@/model/user.entity';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
