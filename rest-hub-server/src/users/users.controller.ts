import { Controller, Get, Param } from '@nestjs/common';

import { UsersService } from './users.service';

import { User } from '@/model/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOneUser(id);
  }
}
