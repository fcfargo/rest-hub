import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
  CreateUserRequestDto,
  RefreshAccesTokenRequestDto,
  SignInUserRequestDto,
} from './dtos/users.dto';
import { AuthResponseDto, TokenResponseDto } from './dtos/users.response.dto';
import { jwtPayLoad } from './jwt/guards/jwt.payload';
import { UsersService } from './users.service';

import { processEnv } from '@/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  private async checkPassword(checkPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(checkPassword, password);
  }

  private async generateTokens(payload: jwtPayLoad): Promise<TokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: processEnv.JWT_SECRET,
        expiresIn: processEnv.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async verifyToken(token: string): Promise<jwtPayLoad> {
    return this.jwtService.verifyAsync(token, {
      secret: processEnv.JWT_SECRET,
    });
  }

  async signup(requestBody: CreateUserRequestDto): Promise<AuthResponseDto> {
    const { username, email, password } = requestBody;

    const user = await this.usersService.findOneUserByEmail(email);
    if (user) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await this.hashPassword(password);

    const requestData = { username, email, password: hashedPassword };
    const newUser = await this.usersService.createUser(requestData);

    const payload: jwtPayLoad = { sub: newUser.id, email: newUser.email };

    const tokens = await this.generateTokens(payload);

    return { user: newUser, tokens };
  }

  async signin(requestBody: SignInUserRequestDto): Promise<AuthResponseDto> {
    const { email, password } = requestBody;

    const user = await this.usersService.findOneUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const isPasswordValid = await this.checkPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid password');
    }

    const payload: jwtPayLoad = { sub: user.id, email: user.email };

    const tokens = await this.generateTokens(payload);

    return { user, tokens };
  }

  async refreshAccessToken(requestBody: RefreshAccesTokenRequestDto): Promise<TokenResponseDto> {
    const { refreshToken } = requestBody;

    const { sub, email } = await this.verifyToken(refreshToken);

    const payload: jwtPayLoad = { sub, email };

    const tokens = await this.generateTokens(payload);

    return tokens;
  }
}
