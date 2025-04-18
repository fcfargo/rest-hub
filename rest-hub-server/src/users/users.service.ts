import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager, UpdateResult } from 'typeorm';

import { CreateUserRequest, UpdateUserDataRequest } from './interfaces/users.interface';
import { UsersRepository } from './users.repository';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUser(userId: number, updateData: UpdateUserDataRequest): Promise<UpdateResult> {
    const result = await this.usersRepository.updateUser(userId, updateData);

    if (result.affected === 0) {
      throw new InternalServerErrorException(`Failed to update user with ID ${userId}`);
    }

    return result;
  }

  async createUser(requestData: CreateUserRequest): Promise<User> {
    return this.usersRepository.createUser(requestData);
  }

  async findOrCreateUser(requestData: CreateUserRequest) {
    const { email } = requestData;
    let user = await this.usersRepository.findOneUserByEmail(email);
    if (!user) {
      user = await this.usersRepository.createUser(requestData);
    }
    return user;
  }

  async findOneUserById(userId: number): Promise<User | null> {
    return this.usersRepository.findOneUserById(userId);
  }

  async findOneUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneUserByEmail(email);
  }

  async incrementFollowingsCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    return this.usersRepository.incrementFollowingsCount(userId, manager);
  }

  async incrementFollowersCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    return this.usersRepository.incrementFollowersCount(userId, manager);
  }

  async decrementFollowingsCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    return this.usersRepository.decrementFollowingsCount(userId, manager);
  }

  async decrementFollowersCount(userId: number, manager?: EntityManager): Promise<UpdateResult> {
    return this.usersRepository.decrementFollowingsCount(userId, manager);
  }
}
