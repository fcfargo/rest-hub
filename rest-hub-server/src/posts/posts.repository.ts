import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { EntityManager, In, Repository, UpdateResult } from 'typeorm';

import { CreatePostRequest, PostWithUser } from './interfaces/posts.interface';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { Post } from '@/model/post.entity';
import { PostLike } from '@/model/postLike.entity';

@Injectable()
export class PostsRepository {
  private readonly post = Post;
  private readonly postLike = PostLike;

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postsLikesRepository: Repository<PostLike>,
  ) {}

  async createPost(requestData: CreatePostRequest): Promise<Post> {
    const post = this.postsRepository.create(requestData);

    return this.postsRepository.save(post);
  }

  async savePost(requestData: Post): Promise<Post> {
    return this.postsRepository.save(requestData);
  }

  async removePost(requestData: Post): Promise<Post> {
    return this.postsRepository.remove(requestData);
  }

  async getPaginatedPosts(
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<{ posts: Post[]; totalCount: number }> {
    const [posts, totalCount] = await this.postsRepository.findAndCount({
      order: { createdAt: order },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    return { posts, totalCount };
  }

  async getPostsByUserOrFollowings(
    userId: number,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<Post[]> {
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate();

    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin(
        'user_follows',
        'follow',
        'follow.followingId = post.userId AND follow.followerId = :userId',
        { userId },
      )
      .where('(post.userId = :userId OR follow.followerId IS NOT NULL)', { userId })
      .andWhere('post.createdAt >= :sevenDaysAgo', {
        sevenDaysAgo,
      })
      .orderBy('post.createdAt', order)
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async countPostsByUserOrFollowings(userId: number): Promise<number> {
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate();

    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoin(
        'user_follows',
        'follow',
        'follow.followingId = post.userId AND follow.followerId = :userId',
        { userId },
      )
      .where('(post.userId = :userId OR follow.followerId IS NOT NULL)', { userId })
      .andWhere('post.createdAt >= :sevenDaysAgo', {
        sevenDaysAgo,
      })
      .getCount();
  }

  async getAllPostsExcludingUserAndFollowings(
    userId: number,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<Post[]> {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin(
        'user_follows',
        'follow',
        'follow.followingId = post.userId AND follow.followerId = :userId',
        { userId },
      )
      .where('post.userId != :userId', { userId })
      .andWhere('follow.followerId IS NULL')
      .orderBy('post.createdAt', order)
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async countAllPostsExcludingUserAndFollowings(userId: number): Promise<number> {
    return this.postsRepository
      .createQueryBuilder('post')
      .leftJoin(
        'user_follows',
        'follow',
        'follow.followingId = post.userId AND follow.followerId = :userId',
        { userId },
      )
      .where('post.userId != :userId', { userId })
      .andWhere('follow.followerId IS NULL')
      .getCount();
  }

  async getPostWithUserById(postId: string): Promise<PostWithUser | null> {
    return this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
  }

  async getPostById(postId: string, manager?: EntityManager): Promise<Post | null> {
    const where = { id: postId };
    return manager ? manager.findOneBy(this.post, where) : this.postsRepository.findOneBy(where);
  }

  async createPostLike(postId: string, userId: number, manager?: EntityManager): Promise<PostLike> {
    const repo = manager ? manager.getRepository(this.postLike) : this.postsLikesRepository;
    const like = repo.create({ postId, userId });
    return repo.save(like);
  }

  async removePostLike(like: PostLike, manager?: EntityManager): Promise<PostLike> {
    const repo = manager ? manager.getRepository(this.postLike) : this.postsLikesRepository;
    return repo.remove(like);
  }

  async incrementPostLikesCount(postId: string, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: postId };
    return manager
      ? manager.increment(this.post, where, 'likesCount', 1)
      : this.postsRepository.increment(where, 'likesCount', 1);
  }

  async decrementPostLikesCount(postId: string, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: postId };
    return manager
      ? manager.decrement(this.post, where, 'likesCount', 1)
      : this.postsRepository.decrement(where, 'likesCount', 1);
  }

  async incrementPostCommentsCount(postId: string, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: postId };
    return manager
      ? manager.increment(this.post, where, 'commentsCount', 1)
      : this.postsRepository.increment(where, 'commentsCount', 1);
  }

  async decrementPostCommentsCount(postId: string, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: postId };
    return manager
      ? manager.decrement(this.post, where, 'commentsCount', 1)
      : this.postsRepository.decrement(where, 'commentsCount', 1);
  }

  async getPostLikeByPostIdAndUserId(
    postId: string,
    userId: number,
    manager?: EntityManager,
  ): Promise<PostLike | null> {
    const where = {
      where: { postId, userId },
    };
    return manager
      ? manager.findOne(this.postLike, where)
      : this.postsLikesRepository.findOne(where);
  }

  async getLikedPostLikesByPostIdAndUserId(postIds: string[], userId: number): Promise<PostLike[]> {
    return this.postsLikesRepository.find({
      where: { userId, postId: In(postIds) },
    });
  }

  async hasUserLikedPost(postId: string, userId: number): Promise<boolean> {
    const result = await this.postsLikesRepository.findOne({
      where: { postId, userId },
      select: ['id'],
    });
    return !!result;
  }
}
