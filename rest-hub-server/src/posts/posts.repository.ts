import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository, UpdateResult } from 'typeorm';

import {
  CreatePostRequest,
  PostWithUser,
  PostWithUserAndIsLiked,
} from './interfaces/posts.interface';

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
    userId: number,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<{ posts: PostWithUserAndIsLiked[]; totalCount: number }> {
    const [posts, totalCount] = await this.postsRepository.findAndCount({
      order: { createdAt: order },
      take: limit,
      skip: offset,
      relations: ['user'],
    });

    if (!posts.length) {
      return { posts: [], totalCount };
    }

    const postIds = posts.map((post) => post.id);
    const likedPostLikes = await this.getLikedPostLikesByPostIdAndUserId(postIds, userId);

    const likedPostIdSet = new Set(likedPostLikes.map((like) => like.postId));

    const postsWithIsLiked = posts.map((post) => ({
      ...post,
      isLiked: likedPostIdSet.has(post.id),
    }));

    return { posts: postsWithIsLiked, totalCount };
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
