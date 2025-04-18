import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';

import {
  FollowUserRequestDto,
  GetFollowersRequestDto,
  GetFollowingsRequestDto,
  IsFollowingRequestDto,
} from './dtos/follow.dto';
import { FollowRepository } from './follow.repository';
import {
  GetPaginatedFollowersResponse,
  GetPaginatedFollowingsResponse,
  IsFollowingResponse,
  UnfollowUserRequest,
} from './interfaces/follow.interface';

import { ORDER_TYPES } from '@/common/constants';
import { Follow } from '@/model/follow.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class FollowService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly followRepository: FollowRepository,
    private readonly usersService: UsersService,

    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async followUser(followerId: number, requestData: FollowUserRequestDto): Promise<Follow> {
    const { followingId } = requestData;

    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const isExist = await this.followRepository.getFollowRelation(followerId, followingId);
    if (isExist) {
      throw new ConflictException('You are already following this user');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const follow = await this.followRepository.followUser({ followerId, followingId }, manager);

      await this.usersService.incrementFollowingsCount(followerId, manager);
      await this.usersService.incrementFollowersCount(followingId, manager);

      await queryRunner.commitTransaction();
      return follow;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('followUser', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async unfollowUser(followerId: number, requestData: UnfollowUserRequest): Promise<Follow> {
    const { followingId } = requestData;

    if (followerId === followingId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const follow = await this.followRepository.getFollowRelation(
        followerId,
        followingId,
        manager,
      );
      if (!follow) {
        throw new NotFoundException('You are not following this user');
      }

      const removed = await this.followRepository.removeFollow(follow, manager);

      await this.usersService.decrementFollowersCount(followingId, manager);
      await this.usersService.decrementFollowingsCount(followerId, manager);

      await queryRunner.commitTransaction();
      return removed;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('unfollowUser', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async isFollowing(
    followerId: number,
    query: IsFollowingRequestDto,
  ): Promise<IsFollowingResponse> {
    const { targetId } = query;

    const follow = await this.followRepository.getFollowRelation(followerId, targetId);
    return { isFollowing: !!follow };
  }

  async getFollowsByUserAndFollowingIds(followingIds: number[], userId: number): Promise<Follow[]> {
    return this.followRepository.getFollowsByUserAndFollowingIds(followingIds, userId);
  }

  async getFollowers(
    userId: number,
    query: GetFollowersRequestDto,
  ): Promise<GetPaginatedFollowersResponse> {
    const { page, limit } = query;

    const order = ORDER_TYPES.ASC;

    const offset = (page - 1) * limit;

    const { followers, totalCount } = await this.followRepository.getPaginatedFollowers(
      userId,
      limit,
      offset,
      order,
    );

    return {
      followers,
      meta: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }

  async getFollowings(
    userId: number,
    query: GetFollowingsRequestDto,
  ): Promise<GetPaginatedFollowingsResponse> {
    const { page, limit } = query;

    const order = ORDER_TYPES.ASC;

    const offset = (page - 1) * limit;

    const { followings, totalCount } = await this.followRepository.getPaginatedFollowings(
      userId,
      limit,
      offset,
      order,
    );

    return {
      followings,
      meta: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
  }
}
