import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findOneUser(id: number): Promise<User | null> {
    return this.userRepository.findOneUserById(id);
  }
}
