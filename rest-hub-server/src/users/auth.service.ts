import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import {
  CreateUserRequestDto,
  RefreshAccesTokenRequestDto,
  SignInUserRequestDto,
  VerifyGoogleOAuthRequestDto,
} from './dtos/users.dto';
import { AuthResponseDto, TokenResponseDto } from './dtos/users.response.dto';
import { jwtPayLoad } from './jwt/guards/jwt.payload';
import { UsersService } from './users.service';

import { processEnv } from '@/common/constants';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client();
  }

  private async _hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  private async _checkPassword(checkPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(checkPassword, password);
  }

  private async _generateTokens(payload: jwtPayLoad): Promise<TokenResponseDto> {
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

    const hashedPassword = await this._hashPassword(password);

    const requestData = { username, email, password: hashedPassword };
    const newUser = await this.usersService.createUser(requestData);

    const payload: jwtPayLoad = { sub: newUser.id, email: newUser.email };

    const tokens = await this._generateTokens(payload);

    return { user: newUser, tokens };
  }

  async signin(requestBody: SignInUserRequestDto): Promise<AuthResponseDto> {
    const { email, password } = requestBody;

    const user = await this.usersService.findOneUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const isPasswordValid = await this._checkPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid password');
    }

    const payload: jwtPayLoad = { sub: user.id, email: user.email };

    const tokens = await this._generateTokens(payload);

    return { user, tokens };
  }

  async refreshAccessToken(requestBody: RefreshAccesTokenRequestDto): Promise<TokenResponseDto> {
    const { refreshToken } = requestBody;

    const { sub, email } = await this.verifyToken(refreshToken);

    const payload: jwtPayLoad = { sub, email };

    const tokens = await this._generateTokens(payload);

    return tokens;
  }

  private async _verifyGoogleIdToken(id_token: string): Promise<TokenPayload> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: id_token,
        audience: processEnv.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('invalid Google ID token');
      }
      return payload;
    } catch (error) {
      this.logger.error(`_verifyGoogleIdToken`, error);
      throw new UnauthorizedException(`Google ID token verification failed: ${error}`);
    }
  }

  async verifyGoogleOAuth(requestBody: VerifyGoogleOAuthRequestDto): Promise<AuthResponseDto> {
    const { id_token } = requestBody;

    const payload = await this._verifyGoogleIdToken(id_token);

    const { email, name, picture } = payload;
    if (!email || !name) {
      throw new InternalServerErrorException('Google response missing required fields');
    }

    const user = await this.usersService.findOrCreateUser({
      email,
      username: name,
      profileImage: picture,
    });

    const jwtPayload: jwtPayLoad = { sub: user.id, email: user.email };
    const tokens = await this._generateTokens(jwtPayload);

    return { user, tokens };
  }
}
