import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository, UpdateResult } from 'typeorm';

import {
  CreateUserRequest,
  UpdateUserPasswordDataRequest,
  UpdateUserProfileDataRequest,
  UpdateUserRefreshTokenDataRequest,
} from './interfaces/users.interface';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersRepository {
  private readonly user = User;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async updateUserProfile(
    userId: number,
    updateData: UpdateUserProfileDataRequest,
  ): Promise<UpdateResult> {
    return this.usersRepository.update({ id: userId }, updateData);
  }

  async updateUserPassword(
    userId: number,
    updateData: UpdateUserPasswordDataRequest,
  ): Promise<UpdateResult> {
    return this.usersRepository.update({ id: userId }, updateData);
  }

  async updateUserRefreshToken(
    userId: number,
    updateData: UpdateUserRefreshTokenDataRequest,
  ): Promise<UpdateResult> {
    return this.usersRepository.update({ id: userId }, updateData);
  }

  async createUser(requestData: CreateUserRequest): Promise<User> {
    const user = this.usersRepository.create(requestData);

    return this.usersRepository.save(user);
  }

  async findOneUserById(userId: number, manager?: EntityManager): Promise<User | null> {
    const options = {
      where: { id: userId, deletedAt: IsNull() },
    };
    return manager ? manager.findOne(this.user, options) : this.usersRepository.findOne(options);
  }

  async findOneUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async incrementFollowingsCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: userId };
    return manager
      ? manager.increment(this.user, where, 'followingsCount', 1)
      : this.usersRepository.increment(where, 'followingsCount', 1);
  }

  async incrementFollowersCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: userId };
    return manager
      ? manager.increment(this.user, where, 'followersCount', 1)
      : this.usersRepository.increment(where, 'followersCount', 1);
  }

  async decrementFollowingsCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: userId };
    return manager
      ? manager.decrement(this.user, where, 'followingsCount', 1)
      : this.usersRepository.decrement(where, 'followingsCount', 1);
  }

  async decrementFollowersCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    const where = { id: userId };
    return manager
      ? manager.decrement(this.user, where, 'followersCount', 1)
      : this.usersRepository.decrement(where, 'followersCount', 1);
  }
}
