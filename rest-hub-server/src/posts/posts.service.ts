import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CreatePostRequestDto, GetPostsRequestDto, UpdatePostRequestDto } from './dtos/posts.dto';
import { CommonMessageResponseDto } from './dtos/posts.response.dto';
import { getPaginatedPostsResponse, PostWithUser } from './interfaces/posts.interface';
import { PostsRepository } from './posts.repository';

import { ORDER_TYPES } from '@/common/constants';
import { Post } from '@/model/post.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createPost(userId: number, requestData: CreatePostRequestDto): Promise<Post> {
    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.postsRepository.createPost({
      ...requestData,
      user,
    });
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
  async getPaginatedPosts(query: GetPostsRequestDto): Promise<getPaginatedPostsResponse> {
    const { page, limit } = query;

    const order = ORDER_TYPES.DESC;

    const offset = (page - 1) * limit;

    const { posts, totalCount } = await this.postsRepository.getPaginatedPosts(
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
  ): Promise<PostWithUser> {
    const { content, location } = requestData;

    const post = await this.postsRepository.getPostAndUserById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this._validatePostOwnership(userId, post.user.id);

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
    const post = await this.postsRepository.getPostAndUserById(postId);
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
}
