import { Injectable } from '@nestjs/common';

import { CreateUserRequest } from './interfaces/users.interface';
import { UsersRepository } from './users.repository';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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

  async findOneUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOneUserById(id);
  }

  async findOneUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneUserByEmail(email);
  }
}
