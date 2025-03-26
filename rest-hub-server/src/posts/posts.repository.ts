import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostRequest, PostWithUser } from './interfaces/posts.interface';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { Post } from '@/model/post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async createPost(requestData: CreatePostRequest): Promise<Post> {
    const post = this.postsRepository.create(requestData);

    return this.postsRepository.save(post);
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

  async getPostAndUserById(postId: string): Promise<PostWithUser | null> {
    return this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
  }

  async getPostById(postId: string): Promise<Post | null> {
    return this.postsRepository.findOneBy({
      id: postId,
    });
  }

  async savePost(requestData: Post): Promise<Post> {
    return this.postsRepository.save(requestData);
  }

  async removePost(requestData: Post): Promise<Post> {
    return this.postsRepository.remove(requestData);
  }
}
