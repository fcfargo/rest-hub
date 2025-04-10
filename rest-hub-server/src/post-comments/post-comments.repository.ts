import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';

import { CreatePostCommentRequest } from './interfaces/ponst-comments.interface';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { PostComment } from '@/model/postComment.entity';

@Injectable()
export class PostCommentsRepository {
  private readonly postComment = PostComment;

  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentsRepository: Repository<PostComment>,
  ) {}

  async createPostComment(
    requestData: CreatePostCommentRequest,
    manager?: EntityManager,
  ): Promise<PostComment> {
    const repo = manager ? manager.getRepository(this.postComment) : this.postCommentsRepository;
    const postComment = repo.create(requestData);
    return repo.save(postComment);
  }

  async savePostComment(requestData: PostComment): Promise<PostComment> {
    return this.postCommentsRepository.save(requestData);
  }

  async removePostComment(requestData: PostComment, manager?: EntityManager): Promise<PostComment> {
    return manager
      ? manager.remove(this.postComment, requestData)
      : this.postCommentsRepository.remove(requestData);
  }

  async getPostCommentById(
    commentId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    const where = { id: commentId };
    return manager
      ? manager.findOneBy(this.postComment, where)
      : this.postCommentsRepository.findOneBy(where);
  }

  async getPostCommentByIdAndPostId(
    commentId: string,
    postId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    const where = { id: commentId, postId };
    return manager
      ? manager.findOne(this.postComment, { where })
      : this.postCommentsRepository.findOne({ where });
  }

  async getPostCommentWithUserAndRepliesById(
    commentId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    const options = {
      where: { id: commentId },
      relations: ['user', 'children', 'children.user', 'post'],
    };
    return manager
      ? manager.findOne(this.postComment, options)
      : this.postCommentsRepository.findOne(options);
  }

  async getPaginatedPostCommentsByPostId(
    userId: number,
    postId: string,
    limit: number,
    offset: number,
    order: OrderTypes,
  ) {
    const [comments, totalCount] = await this.postCommentsRepository.findAndCount({
      where: {
        postId,
        parentId: IsNull(),
      },
      order: { createdAt: order },
      take: limit,
      skip: offset,
      relations: ['user', 'children', 'children.user', 'post'],
    });

    if (!comments.length) {
      return { comments: [], totalCount };
    }

    return { comments, totalCount };
  }
}
