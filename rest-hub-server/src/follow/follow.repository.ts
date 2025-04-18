import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import {
  FollowUserRequest,
  PaginatedFollowersRawResponse,
  PaginatedFollowingsRawResponse,
} from './interfaces/follow.interface';

import { OrderTypes } from '@/common/interfaces/common.interface';
import { Follow } from '@/model/follow.entity';
import { UserSummary } from '@/users/interfaces/users.interface';

@Injectable()
export class FollowRepository {
  private readonly follow = Follow;
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async followUser(requestData: FollowUserRequest, manager?: EntityManager): Promise<Follow> {
    const repo = manager ? manager.getRepository(this.follow) : this.followRepository;
    const follow = repo.create(requestData);
    return repo.save(follow);
  }

  async getFollowRelation(
    followerId: number,
    followingId: number,
    manager?: EntityManager,
  ): Promise<Follow | null> {
    const options = {
      where: { followerId, followingId },
    };
    return manager ? manager.findOne(this.follow, options) : this.followRepository.findOne(options);
  }

  async getFollowsByUserAndFollowingIds(followingIds: number[], userId: number): Promise<Follow[]> {
    return this.followRepository.find({
      where: { followerId: userId, followingId: In(followingIds) },
    });
  }

  async removeFollow(follow: Follow, manager?: EntityManager): Promise<Follow> {
    const repo = manager ? manager.getRepository(this.follow) : this.followRepository;
    return repo.remove(follow);
  }

  async getPaginatedFollowers(
    userId: number,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<PaginatedFollowersRawResponse> {
    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('users', 'user', 'user.id = follow.followerId')
      .where('follow.followingId = :userId', { userId });

    const [followers, totalCount] = await Promise.all([
      queryBuilder
        .clone()
        .select(['user.id AS id', 'user.username AS username', 'user.profileImage AS profileImage'])
        .orderBy('follow.createdAt', order)
        .limit(limit)
        .offset(offset)
        .getRawMany<UserSummary>(),

      queryBuilder.clone().getCount(),
    ]);

    return { followers, totalCount };
  }

  async getPaginatedFollowings(
    userId: number,
    limit: number,
    offset: number,
    order: OrderTypes,
  ): Promise<PaginatedFollowingsRawResponse> {
    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('users', 'user', 'user.id = follow.followingId')
      .where('follow.followerId = :userId', { userId });

    const [followings, totalCount] = await Promise.all([
      queryBuilder
        .clone()
        .select(['user.id AS id', 'user.username AS username', 'user.profileImage AS profileImage'])
        .orderBy('follow.createdAt', order)
        .limit(limit)
        .offset(offset)
        .getRawMany<UserSummary>(),

      queryBuilder.clone().getCount(),
    ]);

    return { followings, totalCount };
  }
}
