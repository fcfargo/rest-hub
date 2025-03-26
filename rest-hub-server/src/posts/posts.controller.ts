import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreatePostRequestDto, GetPostsRequestDto, UpdatePostRequestDto } from './dtos/posts.dto';
import { GetPostsResponseDto, PostResponseDto } from './dtos/posts.response.dto';
import { PostsService } from './posts.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { CommonMessageResponseDto } from '@/common/dtos/common.response.dto';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';
import { jwtPayLoad } from '@/users/jwt/guards/jwt.payload';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Serialize(CreatePostRequestDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@CurrentUser() currentUser: jwtPayLoad, @Body() body: CreatePostRequestDto) {
    const userId = currentUser.sub;
    return this.postService.createPost(userId, body);
  }

  @Serialize(GetPostsResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@Query() query: GetPostsRequestDto) {
    return this.postService.getPaginatedPosts(query);
  }

  @Serialize(PostResponseDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  async updatePost(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Body() body: UpdatePostRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postService.updatePost(userId, postId, body);
  }

  @Serialize(CommonMessageResponseDto)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(@CurrentUser() currentUser: jwtPayLoad, @Param('postId') postId: string) {
    const userId = currentUser.sub;
    return this.postService.deletePost(userId, postId);
  }
}
