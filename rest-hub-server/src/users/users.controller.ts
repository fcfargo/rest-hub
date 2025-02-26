import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/users.dto';
import { SignupResponseDto } from './dtos/users.response.dto';
import { UsersService } from './users.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { User } from '@/model/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOneUserById(id);
  }

  @Serialize(SignupResponseDto)
  @Post()
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }
}
