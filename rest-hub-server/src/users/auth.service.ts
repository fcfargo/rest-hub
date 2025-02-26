import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { CreateUserDto } from './dtos/users.dto';
import { SignupResponseDto } from './dtos/users.response.dto';
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

  async signup(requestBody: CreateUserDto): Promise<SignupResponseDto> {
    const { username, email, password } = requestBody;

    const users = await this.usersService.findAllUsersByEmail(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await this.hashPassword(password);

    const requestData = { username, email, password: hashedPassword };
    const user = await this.usersService.createUser(requestData);

    const payload = { sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: processEnv.JWT_SECRET,
        expiresIn: processEnv.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return plainToInstance(
      SignupResponseDto,
      { user, token: { accessToken, refreshToken } },
      { excludeExtraneousValues: true },
    );
  }
}
