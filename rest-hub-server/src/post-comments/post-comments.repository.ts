import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, IsNull, Repository, UpdateResult } from 'typeorm';

import {
  CreatePostCommentRequest,
  GetPaginatedPostCommentsByPostIdResponse,
  GetPaginatedRepliesByPostIdAndCommentIdResponse,
} from './interfaces/post-comments.interface';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { PostComment } from '@/model/postComment.entity';
import { PostCommentLike } from '@/model/postCommentLike.entity';

@Injectable()
export class PostCommentsRepository {
  private readonly postComment = PostComment;
  private readonly postCommentLike = PostCommentLike;

  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentsRepository: Repository<PostComment>,
    @InjectRepository(PostCommentLike)
    private readonly postCommentsLikesRepository: Repository<PostCommentLike>,
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
    const options = {
      where: { id: commentId, postId },
    };
    return manager
      ? manager.findOne(this.postComment, options)
      : this.postCommentsRepository.findOne(options);
  }

  async getPostCommentWithUserByIdAndPostId(
    commentId: string,
    postId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    const options = {
      where: { id: commentId, postId },
      relations: ['user', 'post'],
    };
    return manager
      ? manager.findOne(this.postComment, options)
      : this.postCommentsRepository.findOne(options);
  }

  async getPostCommentWithUserById(
    commentId: string,
    manager?: EntityManager,
  ): Promise<PostComment | null> {
    const options = {
      where: { id: commentId },
      relations: ['user', 'post'],
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
  ): Promise<GetPaginatedPostCommentsByPostIdResponse> {
    const [comments, totalCount] = await this.postCommentsRepository.findAndCount({
      where: {
        postId,
        parentId: IsNull(),
      },
      order: { createdAt: order },
      take: limit,
      skip: offset,
      relations: ['user', 'post'],
    });

    if (!comments.length) {
      return { comments: [], totalCount };
    }

    const commentIds = comments.map((comment) => comment.id);
    const likedPostCommentLikes = await this.getLikedPostCommentLikesByCommentIdAndUserId(
      commentIds,
      userId,
    );

    const likedPostCommentIdSet = new Set(likedPostCommentLikes.map((like) => like.commentId));

    const postCommentsWithIsLiked = comments.map((comment) => ({
      ...comment,
      isLiked: likedPostCommentIdSet.has(comment.id),
    }));

    return { comments: postCommentsWithIsLiked, totalCount };
  }

  async getPaginatedRepliesByPostIdAndParentId(
    userId: number,
    postId: string,
    parentId: string,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<GetPaginatedRepliesByPostIdAndCommentIdResponse> {
    const [replies, totalCount] = await this.postCommentsRepository.findAndCount({
      where: {
        postId,
        parentId,
      },
      order: { createdAt: order },
      take: limit,
      skip: offset,
      relations: ['user', 'post'],
    });

    if (!replies.length) {
      return { replies: [], totalCount };
    }

    const replyIds = replies.map((comment) => comment.id);
    const likedReplyLikes = await this.getLikedPostCommentLikesByCommentIdAndUserId(
      replyIds,
      userId,
    );

    const likedReplyIdSet = new Set(likedReplyLikes.map((like) => like.commentId));

    const repliesWithIsLiked = replies.map((reply) => ({
      ...reply,
      isLiked: likedReplyIdSet.has(reply.id),
    }));

    return { replies: repliesWithIsLiked, totalCount };
  }

  async getLikedPostCommentLikesByCommentIdAndUserId(
    commentIds: string[],
    userId: number,
  ): Promise<PostCommentLike[]> {
    return this.postCommentsLikesRepository.find({
      where: { userId, commentId: In(commentIds) },
    });
  }

  async createPostCommentLike(
    commentId: string,
    userId: number,
    manager?: EntityManager,
  ): Promise<PostCommentLike> {
    const repo = manager
      ? manager.getRepository(this.postCommentLike)
      : this.postCommentsLikesRepository;
    const postCommentLike = repo.create({ commentId, userId });
    return repo.save(postCommentLike);
  }

  async removePostCommentLike(
    requestData: PostCommentLike,
    manager?: EntityManager,
  ): Promise<PostCommentLike> {
    return manager
      ? manager.remove(this.postCommentLike, requestData)
      : this.postCommentsLikesRepository.remove(requestData);
  }

  async getPostCommentLikeByPostIdAndUserId(
    commentId: string,
    userId: number,
    manager?: EntityManager,
  ): Promise<PostCommentLike | null> {
    const where = {
      where: { commentId, userId },
    };
    return manager
      ? manager.findOne(this.postCommentLike, where)
      : this.postCommentsLikesRepository.findOne(where);
  }

  async incrementPostCommentLikesCount(
    commentId: string,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const where = { id: commentId };
    return manager
      ? manager.increment(this.postComment, where, 'likesCount', 1)
      : this.postCommentsRepository.increment(where, 'likesCount', 1);
  }

  async decrementPostCommentLikesCount(
    commentId: string,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const where = { id: commentId };
    return manager
      ? manager.decrement(this.postComment, where, 'likesCount', 1)
      : this.postCommentsRepository.decrement(where, 'likesCount', 1);
  }

  async incrementPostCommentRepliesCount(
    commentId: string,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const where = { id: commentId };
    return manager
      ? manager.increment(this.postComment, where, 'repliesCount', 1)
      : this.postCommentsRepository.increment(where, 'repliesCount', 1);
  }

  async decrementPostCommentRepliesCount(
    commentId: string,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const where = { id: commentId };
    return manager
      ? manager.decrement(this.postComment, where, 'repliesCount', 1)
      : this.postCommentsRepository.decrement(where, 'repliesCount', 1);
  }
}
