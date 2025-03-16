import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { CreatePostRequestDto } from './dtos/posts.dto';
import { PostsService } from './posts.service';

import { CurrentUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';
import { jwtPayLoad } from '@/users/jwt/guards/jwt.payload';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@CurrentUser() currentUser: jwtPayLoad, @Body() body: CreatePostRequestDto) {
    const userId = currentUser.sub;
    return this.postService.createPost(userId, body);
  }
}
