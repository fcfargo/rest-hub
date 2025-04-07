import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostCommentsRepository } from './post-comments.repository';
import { PostCommentsService } from './post-comments.service';

import { PostComment } from '@/model/postComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment])],
  providers: [PostCommentsService, PostCommentsRepository],
  exports: [PostCommentsService],
})
export class PostCommentsModule {}
