import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';

import {
  CreateCommentRequestDto,
  CreatePostRequestDto,
  GetPostsRequestDto,
  UpdateCommentRequestDto,
  UpdatePostRequestDto,
} from './dtos/posts.dto';
import {
  CreateReplyResponse,
  DeleteReplyResponse,
  GetPaginatedPostCommentsResponse,
  GetPaginatedPostsResponse,
  GetPaginatedRepliesResponse,
  PostCommentDetail,
  PostCommentLikeStatusResponse,
  PostLikeStatusResponse,
  PostWithUser,
} from './interfaces/posts.interface';
import { PostsRepository } from './posts.repository';

import { ORDER_TYPES } from '@/common/constants';
import { CommonMessageResponseDto } from '@/common/dtos/common.response.dto';
import { FollowService } from '@/follow/follow.service';
import { PostComment } from '@/model/postComment.entity';
import { NOTIFICATION_TYPES } from '@/notifications/interfaces/notification.interface';
import { NotificationsService } from '@/notifications/notifications.service';
import { PostCommentsService } from '@/post-comments/post-comments.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly postsRepository: PostsRepository,
    private readonly postCommentsService: PostCommentsService,
    private readonly followService: FollowService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createPost(userId: number, requestData: CreatePostRequestDto): Promise<PostWithUser> {
    const created = await this.postsRepository.createPost({
      ...requestData,
      user: { id: userId },
    });

    const fullPost = await this.postsRepository.getPostWithUserById(created.id);

    if (!fullPost) {
      throw new InternalServerErrorException(
        'The post was created, but failed to retrieve it. Please try again.',
      );
    }

    return fullPost;
  }

  private async _getUserLikedPostIds(postIds: string[], userId: number): Promise<Set<string>> {
    const userLikes = await this.postsRepository.getLikedPostLikesByPostIdAndUserId(
      postIds,
      userId,
    );
    return new Set(userLikes.map((like) => like.postId));
  }

  private async _getFollowingUserIds(userIds: number[], userId: number): Promise<Set<number>> {
    const followings = await this.followService.getFollowsByUserAndFollowingIds(userIds, userId);
    return new Set(followings.map((follow) => follow.followingId));
  }

  /**
   * 정렬 우선순위:
   * 1. 나 + 팔로우 유저들의 최신 게시물
   * 2. 나머지 전체 게시물
   */
  async getPaginatedPosts(
    userId: number,
    query: GetPostsRequestDto,
  ): Promise<GetPaginatedPostsResponse> {
    const { page, limit, isPriorityPhase } = query;
    const offset = (page - 1) * limit;
    const order = ORDER_TYPES.DESC;

    let posts: PostWithUser[];
    let totalCount: number;

    if (isPriorityPhase) {
      posts = await this.postsRepository.getPostsByUserOrFollowings(userId, limit, offset, order);
      totalCount = await this.postsRepository.countPostsByUserOrFollowings(userId);
    } else {
      posts = await this.postsRepository.getAllPostsExcludingUserAndFollowings(
        userId,
        limit,
        offset,
        order,
      );
      totalCount = await this.postsRepository.countAllPostsExcludingUserAndFollowings(userId);
    }

    const totalPages = Math.ceil(totalCount / limit);

    if (!posts.length) {
      return {
        posts: [],
        meta: {
          totalPages,
          currentPage: page,
        },
      };
    }

    const postIds = posts.map((post) => post.id);
    const authorIds = posts.map((post) => post.user.id);

    const [likedPostIdSet, followingAuthorIdSet] = await Promise.all([
      this._getUserLikedPostIds(postIds, userId),
      this._getFollowingUserIds(authorIds, userId),
    ]);

    const postsWithFlags = posts.map((post) => ({
      ...post,
      isLiked: likedPostIdSet.has(post.id),
      isFollowing: followingAuthorIdSet.has(post.user.id),
    }));

    return {
      posts: postsWithFlags,
      meta: {
        totalPages,
        currentPage: page,
      },
    };
  }

  private _validatePostOwnership(userId: number, postUserId: number) {
    if (userId !== postUserId) {
      throw new ForbiddenException('You are not authorized to modify this post');
    }
  }

  async updatePost(
    userId: number,
    postId: string,
    requestData: UpdatePostRequestDto,
  ): Promise<PostWithUser> {
    const { content, location } = requestData;

    const post = await this.postsRepository.getPostWithUserById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this._validatePostOwnership(userId, post.userId);

    post.content = content;
    post.location = location;

    try {
      const updated = await this.postsRepository.savePost(post);
      return { ...updated, user: post.user };
    } catch (err) {
      this.logger.error(`updatePost`, err);
      throw new InternalServerErrorException('Failed to update the post. Please try again');
    }
  }

  async deletePost(userId: number, postId: string): Promise<CommonMessageResponseDto> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this._validatePostOwnership(userId, post.userId);

    try {
      await this.postsRepository.removePost(post);
      return { message: 'Post deleted successfully' };
    } catch (err) {
      this.logger.error(`deletePost`, err);
      throw new InternalServerErrorException('Failed to delete the post. Please try again');
    }
  }

  async likePost(postId: string, userId: number): Promise<PostLikeStatusResponse> {
    return this._runLikePostTransaction(postId, userId);
  }

  private async _runLikePostTransaction(
    postId: string,
    userId: number,
  ): Promise<PostLikeStatusResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const existing = await this.postsRepository.getPostLikeByPostIdAndUserId(
        postId,
        userId,
        manager,
      );

      if (!existing) {
        await this.postsRepository.createPostLike(postId, userId, manager);
        await this.postsRepository.incrementPostLikesCount(postId, manager);
        post.likesCount += 1;
      }

      const updated = await this.postsRepository.getPostById(postId, manager);
      if (!updated) {
        throw new NotFoundException(`Post with ID ${postId} not found after like`);
      }

      const { userId: authorId } = post;

      const isDuplicate = await this.notificationsService.isDuplicateLikeNotification(
        authorId,
        userId,
        postId,
        manager,
      );

      if (!isDuplicate) {
        await this.notificationsService.createLikeNotification(
          {
            userId: authorId,
            actorId: userId,
            type: NOTIFICATION_TYPES.LIKE,
            postId,
          },
          manager,
        );
      }

      await queryRunner.commitTransaction();

      return {
        isLiked: true,
        likesCount: updated.likesCount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`_runLikePostTransaction`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async unlikePost(postId: string, userId: number): Promise<PostLikeStatusResponse> {
    return this._runUnlikePostTransaction(postId, userId);
  }

  private async _runUnlikePostTransaction(
    postId: string,
    userId: number,
  ): Promise<PostLikeStatusResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const existing = await this.postsRepository.getPostLikeByPostIdAndUserId(
        postId,
        userId,
        manager,
      );

      if (existing) {
        await this.postsRepository.removePostLike(existing, manager);
        await this.postsRepository.decrementPostLikesCount(postId, manager);
      }

      const updated = await this.postsRepository.getPostById(postId, manager);
      if (!updated) {
        throw new NotFoundException(`Post with ID ${postId} not found after unlike`);
      }

      await queryRunner.commitTransaction();

      return {
        isLiked: false,
        likesCount: updated.likesCount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`_runUnlikePostTransaction`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createComment(
    userId: number,
    postId: string,
    requestData: CreateCommentRequestDto,
  ): Promise<PostComment> {
    return this._runCreateCommentTransaction(userId, postId, requestData);
  }

  async createReply(
    userId: number,
    postId: string,
    parentId: string,
    requestData: CreateCommentRequestDto,
  ): Promise<CreateReplyResponse> {
    const created = await this._runCreateCommentTransaction(userId, postId, requestData, parentId);

    const parent = await this.postCommentsService.getPostCommentById(parentId);
    if (!parent) {
      throw new NotFoundException('Parent comment not found after reply creation.');
    }

    return {
      reply: created,
      parentRepliesCount: parent.repliesCount,
    };
  }

  async _runCreateCommentTransaction(
    userId: number,
    postId: string,
    requestData: CreateCommentRequestDto,
    parentId?: string,
  ): Promise<PostComment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      const { content } = requestData;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) throw new NotFoundException('Post not found');

      if (parentId) {
        const parent = await this.postCommentsService.getPostCommentById(parentId, manager);
        if (!parent) {
          throw new NotFoundException('Parent comment not found');
        }
        if (parent.parentId) {
          throw new BadRequestException('Only 1-level nested replies are allowed');
        }

        await this.postCommentsService.incrementPostCommentRepliesCount(parentId, manager);
      }

      const created = await this.postCommentsService.createPostComment(
        { postId, userId, content, parentId },
        manager,
      );

      await this.postsRepository.incrementPostCommentsCount(postId, manager);

      const fullComment = await this.postCommentsService.getPostCommentWithUserById(
        created.id,
        manager,
      );

      if (!fullComment) {
        throw new InternalServerErrorException('Comment created but retrieval failed.');
      }

      await queryRunner.commitTransaction();
      return fullComment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`_runCreateCommentTransaction`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCommentsByPostId(
    userId: number,
    postId: string,
    query: GetPostsRequestDto,
  ): Promise<GetPaginatedPostCommentsResponse> {
    const { page, limit } = query;

    const order = ORDER_TYPES.DESC;

    const offset = (page - 1) * limit;

    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { comments, totalCount } =
      await this.postCommentsService.getPaginatedPostCommentsByPostId(
        userId,
        postId,
        limit,
        offset,
        order,
      );

    return {
      comments,
      meta: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  async getReplies(
    userId: number,
    postId: string,
    parentId: string,
    query: GetPostsRequestDto,
  ): Promise<GetPaginatedRepliesResponse> {
    const { page, limit } = query;

    const order = ORDER_TYPES.DESC;

    const offset = (page - 1) * limit;

    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const parent = await this.postCommentsService.getPostCommentById(parentId);
    if (!parent) {
      throw new NotFoundException(`Comment with ID ${parentId} not found`);
    }

    const { replies, totalCount } =
      await this.postCommentsService.getPaginatedRepliesByPostIdAndParentId(
        userId,
        postId,
        parentId,
        limit,
        offset,
        order,
      );

    return {
      replies,
      meta: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  private _validateCommentOwnership(userId: number, commentUserId: number) {
    if (userId !== commentUserId) {
      throw new ForbiddenException('You are not authorized to modify this post');
    }
  }

  async updateComment(
    userId: number,
    postId: string,
    commentId: string,
    requestData: UpdateCommentRequestDto,
  ): Promise<PostCommentDetail> {
    const { content } = requestData;

    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.postCommentsService.getPostCommentWithUserByIdAndPostId(
      commentId,
      post.id,
    );
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    this._validateCommentOwnership(userId, comment.userId);

    comment.content = content;

    try {
      const updated = await this.postCommentsService.savePostComment(comment);
      return { ...updated, user: comment.user, post };
    } catch (err) {
      this.logger.error(`updateComment`, err);
      throw new InternalServerErrorException('Failed to update the comment. Please try again');
    }
  }

  async deleteComment(
    userId: number,
    postId: string,
    commentId: string,
  ): Promise<CommonMessageResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const comment = await this.postCommentsService.getPostCommentByIdAndPostId(
        commentId,
        post.id,
        manager,
      );
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      this._validateCommentOwnership(userId, comment.userId);

      await this.postCommentsService.removePostComment(comment, manager);
      await this.postsRepository.decrementPostCommentsCount(postId, manager);

      await queryRunner.commitTransaction();
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`deleteComment`, error);
      throw new InternalServerErrorException('Failed to delete the comment. Please try again');
    } finally {
      await queryRunner.release();
    }
  }

  async updateReply(
    userId: number,
    postId: string,
    parentId: string,
    replyId: string,
    requestData: UpdateCommentRequestDto,
  ): Promise<PostCommentDetail> {
    const { content } = requestData;

    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const reply = await this.postCommentsService.getPostCommentWithUserByIdAndPostId(
      replyId,
      post.id,
    );

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (!reply.parentId) {
      throw new BadRequestException('Target is not a reply.');
    }

    if (reply.parentId !== parentId) {
      throw new BadRequestException('Reply does not belong to the specified parent comment.');
    }

    this._validateCommentOwnership(userId, reply.userId);

    reply.content = content;

    try {
      const updated = await this.postCommentsService.savePostComment(reply);
      return { ...updated, user: reply.user, post };
    } catch (err) {
      this.logger.error(`updateReply`, err);
      throw new InternalServerErrorException('Failed to update the reply. Please try again');
    }
  }

  async deleteReply(
    userId: number,
    postId: string,
    parentId: string,
    replyId: string,
  ): Promise<DeleteReplyResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const reply = await this.postCommentsService.getPostCommentByIdAndPostId(
        replyId,
        post.id,
        manager,
      );
      if (!reply) {
        throw new NotFoundException('Reply not found');
      }

      if (!reply.parentId) {
        throw new BadRequestException('Target is not a reply.');
      }

      if (reply.parentId !== parentId) {
        throw new BadRequestException('Reply does not belong to the specified parent comment.');
      }

      this._validateCommentOwnership(userId, reply.userId);

      await this.postCommentsService.removePostComment(reply, manager);
      await this.postCommentsService.decrementPostCommentRepliesCount(parentId, manager);

      const updatedParent = await this.postCommentsService.getPostCommentById(parentId, manager);
      if (!updatedParent) {
        throw new NotFoundException(`Comment with ID ${parentId} not found after like`);
      }

      await queryRunner.commitTransaction();
      return { parentRepliesCount: updatedParent.repliesCount };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('deleteReply', error);
      throw new InternalServerErrorException('Failed to delete the reply. Please try again');
    } finally {
      await queryRunner.release();
    }
  }

  async likeComment(
    postId: string,
    commentId: string,
    userId: number,
  ): Promise<PostCommentLikeStatusResponse> {
    return this._runLikeCommentTransaction(postId, commentId, userId);
  }

  private async _runLikeCommentTransaction(
    postId: string,
    commentId: string,
    userId: number,
  ): Promise<PostCommentLikeStatusResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const comment = await this.postCommentsService.getPostCommentByIdAndPostId(
        commentId,
        post.id,
        manager,
      );
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const existing = await this.postCommentsService.getPostCommentLikeByPostIdAndUserId(
        commentId,
        userId,
        manager,
      );

      if (!existing) {
        await this.postCommentsService.createPostCommentLike(commentId, userId, manager);
        await this.postCommentsService.incrementPostCommentLikesCount(commentId, manager);
        comment.likesCount = Math.max(0, comment.likesCount + 1);
      }

      const updated = await this.postCommentsService.getPostCommentById(commentId, manager);
      if (!updated) {
        throw new NotFoundException(`Comment with ID ${commentId} not found after like`);
      }

      await queryRunner.commitTransaction();

      return {
        isLiked: true,
        likesCount: updated.likesCount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`_runLikeCommentTransaction`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async unlikeComment(
    postId: string,
    commentId: string,
    userId: number,
  ): Promise<PostCommentLikeStatusResponse> {
    return this._runUnlikeCommentTransaction(postId, commentId, userId);
  }

  private async _runUnlikeCommentTransaction(
    postId: string,
    commentId: string,
    userId: number,
  ): Promise<PostCommentLikeStatusResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const post = await this.postsRepository.getPostById(postId, manager);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const comment = await this.postCommentsService.getPostCommentByIdAndPostId(
        commentId,
        post.id,
        manager,
      );
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const existing = await this.postCommentsService.getPostCommentLikeByPostIdAndUserId(
        commentId,
        userId,
        manager,
      );

      if (existing) {
        await this.postCommentsService.removePostCommentLike(existing, manager);
        await this.postCommentsService.decrementPostCommentLikesCount(commentId, manager);
        comment.likesCount = Math.max(0, comment.likesCount - 1);
      }

      const updated = await this.postCommentsService.getPostCommentById(commentId, manager);
      if (!updated) {
        throw new NotFoundException(`Comment with ID ${commentId} not found after unlike`);
      }

      await queryRunner.commitTransaction();

      return {
        isLiked: false,
        likesCount: updated.likesCount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`_runUnlikeCommentTransaction`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
