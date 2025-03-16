import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePostRequestDto } from './dtos/posts.dto';
import { PostsRepository } from './posts.repository';

import { Post } from '@/model/post.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createPost(userId: number, requestData: CreatePostRequestDto): Promise<Post> {
    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.postsRepository.createPost({
      ...requestData,
      user,
    });
  }
}
