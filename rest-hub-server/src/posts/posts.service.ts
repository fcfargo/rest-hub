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
  CreateCommentDto,
  CreatePostRequestDto,
  GetPostsRequestDto,
  UpdatePostRequestDto,
} from './dtos/posts.dto';
import { CommonMessageResponseDto } from './dtos/posts.response.dto';
import {
  GetPaginatedPostsResponse,
  PostLikeStatusResponse,
  PostWithUser,
  PostWithUserAndIsLiked,
} from './interfaces/posts.interface';
import { PostsRepository } from './posts.repository';

import { ORDER_TYPES } from '@/common/constants';
import { PostComment } from '@/model/postComment.entity';
import { PostCommentsService } from '@/post-comments/post-comments.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly postsRepository: PostsRepository,
    private readonly postCommentsService: PostCommentsService,
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

  /**
   * [TODO: 고도화 예정]
   * 향후 팔로우 기능이 도입되면,
   * - 현재 로그인한 유저의 게시물
   * - + 팔로우한 유저의 게시물
   * 을 우선적으로 정렬해서 먼저 보여주고,
   * 그 외의 게시물은 그 이후에 표시할 예정.
   *
   * 정렬 우선순위:
   * 1. 나 + 팔로우 유저들의 최신 게시물
   * 2. 전체 게시물 (기존 로직)
   */
  async getPaginatedPosts(
    userId: number,
    query: GetPostsRequestDto,
  ): Promise<GetPaginatedPostsResponse> {
    const { page, limit } = query;

    const order = ORDER_TYPES.DESC;

    const offset = (page - 1) * limit;

    const { posts, totalCount } = await this.postsRepository.getPaginatedPosts(
      userId,
      limit,
      offset,
      order,
    );

    return {
      posts,
      meta: {
        totalPages: Math.ceil(totalCount / limit),
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
  ): Promise<PostWithUserAndIsLiked> {
    const { content, location } = requestData;

    const post = await this.postsRepository.getPostWithUserById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this._validatePostOwnership(userId, post.user.id);

    post.content = content;
    post.location = location;

    try {
      const [updated, isLiked] = await Promise.all([
        this.postsRepository.savePost(post),
        this.postsRepository.hasUserLikedPost(postId, userId),
      ]);
      return { ...updated, user: post.user, isLiked };
    } catch (err) {
      this.logger.error(`updatePost`, err);
      throw new InternalServerErrorException('Failed to update the post. Please try again');
    }
  }

  async deletePost(userId: number, postId: string): Promise<CommonMessageResponseDto> {
    const post = await this.postsRepository.getPostWithUserById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this._validatePostOwnership(userId, post.user.id);

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
    requestData: CreateCommentDto,
  ): Promise<PostComment> {
    return this._runCreateCommentTransaction(userId, postId, requestData);
  }

  async _runCreateCommentTransaction(
    userId: number,
    postId: string,
    requestData: CreateCommentDto,
  ): Promise<PostComment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      const { content, parentId } = requestData;

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
      }

      const created = await this.postCommentsService.createPostComment(
        { postId, userId, content, parentId },
        manager,
      );

      await this.postsRepository.incrementPostCommentsCount(postId, manager);

      const fullComment = await this.postCommentsService.getPostCommentWithUserAndRepliesById(
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

  async getCommentsByPostId(userId: number, postId: string, query: GetPostsRequestDto) {
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

    comments.filter((comment) => !comment.parentId);

    return {
      comments,
      meta: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }
}
