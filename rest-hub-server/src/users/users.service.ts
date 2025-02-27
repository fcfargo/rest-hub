import { Injectable } from '@nestjs/common';

import { CreateUserRequestDto } from './dtos/users.dto';
import { UsersRepository } from './users.repository';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(requestData: CreateUserRequestDto): Promise<User> {
    return this.usersRepository.createUser(requestData);
  }

  async findOneUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOneUserById(id);
  }

  async findOneUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneUserByEmail(email);
  }
}
