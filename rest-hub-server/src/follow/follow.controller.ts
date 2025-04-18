import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';

import {
  FollowUserRequestDto,
  GetFollowersRequestDto,
  GetFollowingsRequestDto,
  IsFollowingRequestDto,
} from './dtos/follow.dto';
import {
  FollowResponseDto,
  GetPaginatedFollowersResponseDto,
  GetPaginatedFollowingsResponseDto,
  IsFollowingResponseDto,
} from './dtos/follow.response.dto';
import { FollowService } from './follow.service';
import { UnfollowUserRequest } from './interfaces/follow.interface';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';
import { jwtPayLoad } from '@/users/jwt/guards/jwt.payload';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Serialize(FollowResponseDto)
  @Post()
  async follow(@CurrentUser() currentUser: jwtPayLoad, @Body() body: FollowUserRequestDto) {
    const userId = currentUser.sub;
    return this.followService.followUser(userId, body);
  }

  @Serialize(FollowResponseDto)
  @Delete()
  async unfollow(@CurrentUser() currentUser: jwtPayLoad, @Body() body: UnfollowUserRequest) {
    const userId = currentUser.sub;
    return this.followService.unfollowUser(userId, body);
  }

  @Serialize(IsFollowingResponseDto)
  @Get('is-following')
  async isFollowing(@CurrentUser() currentUser: jwtPayLoad, @Query() query: IsFollowingRequestDto) {
    const userId = currentUser.sub;
    return this.followService.isFollowing(userId, query);
  }

  @Serialize(GetPaginatedFollowersResponseDto)
  @Get('followers/:userId')
  async getFollowers(@CurrentUser() currentUser: jwtPayLoad, query: GetFollowersRequestDto) {
    const userId = currentUser.sub;
    return this.followService.getFollowers(userId, query);
  }

  @Serialize(GetPaginatedFollowingsResponseDto)
  @Get('followings/:userId')
  async getFollowings(@CurrentUser() currentUser: jwtPayLoad, query: GetFollowingsRequestDto) {
    const userId = currentUser.sub;
    return this.followService.getFollowings(userId, query);
  }
}
