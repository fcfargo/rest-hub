import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  RefreshAccesTokenRequestDto,
  ResetPasswordRequestDto,
  SignInUserRequestDto,
  SignOutRequestDto,
  UpdateUserProfileRequestDto,
  VerifyGoogleOAuthRequestDto,
} from './dtos/users.dto';
import { AuthResponseDto, TokenResponseDto, UserResponseDto } from './dtos/users.response.dto';
import { JwtAuthGuard } from './jwt/guards/jwt.guard';
import { jwtPayLoad } from './jwt/guards/jwt.payload';
import { UsersService } from './users.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { CommonMessageResponseDto } from '@/common/dtos/common.response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Serialize(CommonMessageResponseDto)
  @Post('auth/signout')
  async signout(@Body() body: SignOutRequestDto) {
    return this.authService.signout(body);
  }

  @Serialize(AuthResponseDto)
  @Post('auth/google')
  async verifyGoogleOAuth(@Body() body: VerifyGoogleOAuthRequestDto) {
    return this.authService.verifyGoogleOAuth(body);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserResponseDto)
  @Get('auth/me')
  async getUser(@CurrentUser() currentUser: jwtPayLoad) {
    return this.usersService.findOneUserById(currentUser.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Serialize(UserResponseDto)
  @Get(':userId')
  async getUserById(@Param('userId') userId: number) {
    return this.usersService.findOneUserById(userId);
  }

  @Serialize(TokenResponseDto)
  @Post('auth/refresh')
  async refreshAccessToken(@Body() body: RefreshAccesTokenRequestDto) {
    return this.authService.refreshAccessToken(body);
  }

  @Post('auth/reset-password')
  async resetPassword(@Body() body: ResetPasswordRequestDto) {
    return this.authService.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/change-password')
  async changePassword(
    @CurrentUser() currentUser: jwtPayLoad,
    @Body() body: ChangePasswordRequestDto,
  ) {
    return this.authService.changePassword(currentUser.sub, body);
  }

  @Serialize(UserResponseDto)
  @UseGuards(JwtAuthGuard)
  @Patch(':userId/profile')
  async updateUserProfile(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('userId') userId: number,
    @Body() body: UpdateUserProfileRequestDto,
  ) {
    const currentUserId = currentUser.sub;
    const targetUserId = Number(userId);
    return this.usersService.updateUserProfile(currentUserId, targetUserId, body);
  }
}
