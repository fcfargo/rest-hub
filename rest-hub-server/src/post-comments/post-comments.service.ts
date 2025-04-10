import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import {
  CreatePostCommentRequest,
  GetPaginatedPostCommentsResponse,
} from './interfaces/ponst-comments.interface';
import { PostCommentsRepository } from './post-comments.repository';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { PostComment } from '@/model/postComment.entity';

@Injectable()
export class PostCommentsService {
  constructor(private readonly postCommentRepository: PostCommentsRepository) {}

  async createPostComment(
    requestData: CreatePostCommentRequest,
    manager?: EntityManager,
  ): Promise<PostComment> {
    const created = await this.postCommentRepository.createPostComment(requestData, manager);

    if (!created) {
      throw new InternalServerErrorException(
        'Post comment creation failed. The comment could not be persisted in the database.',
      );
    }

    return created;
  }

  async savePostComment(comment: PostComment): Promise<PostComment> {
    return this.postCommentRepository.savePostComment(comment);
  }

  async removePostComment(comment: PostComment, manager?: EntityManager): Promise<PostComment> {
    return this.postCommentRepository.removePostComment(comment, manager);
  }

  async getPostCommentWithUserAndRepliesById(
    commentId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    return this.postCommentRepository.getPostCommentWithUserAndRepliesById(commentId, manager);
  }

  async getPostCommentById(
    commentId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    return this.postCommentRepository.getPostCommentById(commentId, manager);
  }

  async getPostCommentByIdAndPostId(
    commentId: string,
    postId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    return this.postCommentRepository.getPostCommentByIdAndPostId(commentId, postId, manager);
  }

  async getPaginatedPostCommentsByPostId(
    userId: number,
    postId: string,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<GetPaginatedPostCommentsResponse> {
    return this.postCommentRepository.getPaginatedPostCommentsByPostId(
      userId,
      postId,
      limit,
      offset,
      order,
    );
  }
}
