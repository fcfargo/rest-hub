import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { CreateUserRequest, UpdateUserData } from './interfaces/users.interface';
import { UsersRepository } from './users.repository';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUser(userId: number, updateData: UpdateUserData): Promise<UpdateResult> {
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
}
