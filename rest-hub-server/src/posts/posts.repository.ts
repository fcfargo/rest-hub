import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostRequest } from './interfaces/posts.interface';

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
}
