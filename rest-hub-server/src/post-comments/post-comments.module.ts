import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostCommentsRepository } from './post-comments.repository';
import { PostCommentsService } from './post-comments.service';

import { PostComment } from '@/model/postComment.entity';
import { PostCommentLike } from '@/model/postCommentLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment, PostCommentLike])],
  providers: [PostCommentsService, PostCommentsRepository],
  exports: [PostCommentsService],
})
export class PostCommentsModule {}
