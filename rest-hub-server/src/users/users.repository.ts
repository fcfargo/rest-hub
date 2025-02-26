import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { CreateUserDto } from './dtos/users.dto';

import { User } from '@/model/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(requestData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(requestData);

    return this.usersRepository.save(user);
  }

  async findOneUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findAllUsersByEmail(email: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { email, deletedAt: IsNull() },
    });
  }
}
