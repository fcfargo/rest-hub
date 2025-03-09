import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, UpdateResult } from 'typeorm';

import { CreateUserRequest, UpdateUserData } from './interfaces/users.interface';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async updateUser(userId: number, updateData: UpdateUserData): Promise<UpdateResult> {
    return this.usersRepository.update({ id: userId }, updateData);
  }

  async createUser(requestData: CreateUserRequest): Promise<User> {
    const user = this.usersRepository.create(requestData);

    return this.usersRepository.save(user);
  }

  async findOneUserById(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });
  }

  async findOneUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }
}
