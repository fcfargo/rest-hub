import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto, SignInUserDto } from './dtos/users.dto';
import { AuthResponseDto, UserResponseDto } from './dtos/users.response.dto';
import { UsersService } from './users.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { User } from '@/model/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Serialize(UserResponseDto)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOneUserById(id);
  }

  @Serialize(AuthResponseDto)
  @Post('auth/signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Serialize(AuthResponseDto)
  @Post('auth/signin')
  async signin(@Body() body: SignInUserDto) {
    return this.authService.signin(body);
  }
}
