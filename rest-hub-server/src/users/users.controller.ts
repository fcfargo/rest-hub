import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserRequestDto, SignInUserRequestDto } from './dtos/users.dto';
import { AuthResponseDto, UserResponseDto } from './dtos/users.response.dto';
import { JwtAuthGuard } from './jwt/guards/jwt.guard';
import { jwtPayLoad } from './jwt/guards/jwt.payload';
import { UsersService } from './users.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { User } from '@/model/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Serialize(UserResponseDto)
  @Get('auth/me')
  async getUser(@CurrentUser() currentUser: jwtPayLoad): Promise<User | null> {
    return this.usersService.findOneUserById(currentUser.sub);
  }

  @Serialize(AuthResponseDto)
  @Post('auth/signup')
  async signup(@Body() body: CreateUserRequestDto) {
    return this.authService.signup(body);
  }

  @Serialize(AuthResponseDto)
  @Post('auth/signin')
  async signin(@Body() body: SignInUserRequestDto) {
    return this.authService.signin(body);
  }
}
