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

import {
  CreateCommentRequestDto,
  CreatePostRequestDto,
  GetPostsRequestDto,
  UpdateCommentRequestDto,
  UpdatePostRequestDto,
} from './dtos/posts.dto';
import {
  CreateReplyResponseDto,
  DeleteReplyResponseDto,
  GetPostCommentsResponseDto,
  GetPostsResponseDto,
  GetRepliesResponseDto,
  PostCommentLikeStatusResponseDto,
  PostCommentResponseDto,
  PostLikeStatusResponseDto,
  PostResponseDto,
} from './dtos/posts.response.dto';
import { PostsService } from './posts.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { CommonMessageResponseDto } from '@/common/dtos/common.response.dto';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';
import { jwtPayLoad } from '@/users/jwt/guards/jwt.payload';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Serialize(PostResponseDto)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@CurrentUser() currentUser: jwtPayLoad, @Body() body: CreatePostRequestDto) {
    const userId = currentUser.sub;
    return this.postsService.createPost(userId, body);
  }

  @Serialize(PostResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  async getPost(@CurrentUser() currentUser: jwtPayLoad, @Param('postId') postId: string) {
    const userId = currentUser.sub;
    return this.postsService.getPost(userId, postId);
  }

  @Serialize(GetPostsResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@CurrentUser() currentUser: jwtPayLoad, @Query() query: GetPostsRequestDto) {
    const userId = currentUser.sub;
    return this.postsService.getPaginatedPosts(userId, query);
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
    return this.postsService.updatePost(userId, postId, body);
  }

  @Serialize(CommonMessageResponseDto)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(@CurrentUser() currentUser: jwtPayLoad, @Param('postId') postId: string) {
    const userId = currentUser.sub;
    return this.postsService.deletePost(userId, postId);
  }

  @Serialize(PostLikeStatusResponseDto)
  @UseGuards(JwtAuthGuard)
  @Post(':postId/like')
  async likePost(@CurrentUser() currentUser: jwtPayLoad, @Param('postId') postId: string) {
    const userId = currentUser.sub;
    return this.postsService.likePost(postId, userId);
  }

  @Serialize(PostLikeStatusResponseDto)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/like')
  async unlikePost(@CurrentUser() currentUser: jwtPayLoad, @Param('postId') postId: string) {
    const userId = currentUser.sub;
    return this.postsService.unlikePost(postId, userId);
  }

  @Serialize(PostCommentResponseDto)
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comment')
  async createComment(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Body() body: CreateCommentRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postsService.createComment(userId, postId, body);
  }

  @Serialize(GetPostCommentsResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get(':postId/comments')
  async getComments(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Query() query: GetPostsRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postsService.getCommentsByPostId(userId, postId, query);
  }

  @Serialize(PostResponseDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':postId/comments/:commentId')
  async updateComment(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postsService.updateComment(userId, postId, commentId, body);
  }

  @Serialize(CommonMessageResponseDto)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId')
  async deleteComment(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    const userId = currentUser.sub;
    return this.postsService.deleteComment(userId, postId, commentId);
  }

  @Serialize(PostCommentLikeStatusResponseDto)
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments/:commentId/like')
  async likePostComment(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    const userId = currentUser.sub;
    return this.postsService.likeComment(postId, commentId, userId);
  }

  @Serialize(PostCommentLikeStatusResponseDto)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId/like')
  async unlikePostComment(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    const userId = currentUser.sub;
    return this.postsService.unlikeComment(postId, commentId, userId);
  }

  @Serialize(CreateReplyResponseDto)
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments/:commentId/reply')
  async createReply(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: CreateCommentRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postsService.createReply(userId, postId, commentId, body);
  }

  @Serialize(GetRepliesResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get(':postId/comments/:commentId/replies')
  async getReplies(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Query() query: GetPostsRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postsService.getReplies(userId, postId, commentId, query);
  }

  @Serialize(PostResponseDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':postId/comments/:commentId/replies/:replyId')
  async updateReply(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
    @Body() body: UpdateCommentRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.postsService.updateReply(userId, postId, commentId, replyId, body);
  }

  @Serialize(DeleteReplyResponseDto)
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId/replies/:replyId')
  async deleteReply(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Param('replyId') replyId: string,
  ) {
    const userId = currentUser.sub;
    return this.postsService.deleteReply(userId, postId, commentId, replyId);
  }
}
