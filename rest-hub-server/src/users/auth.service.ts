import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

import {
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  RefreshAccesTokenRequestDto,
  ResetPasswordRequestDto,
  SignInUserRequestDto,
  SignOutRequestDto,
  VerifyGoogleOAuthRequestDto,
} from './dtos/users.dto';
import { TokenResponseDto } from './dtos/users.response.dto';
import { SignupResponse, SOCIAL_PROVIDERS } from './interfaces/users.interface';
import { jwtPayLoad } from './jwt/guards/jwt.payload';
import { UsersService } from './users.service';

import { ERROR_CODE, processEnv } from '@/common/constants';
import { QueueService } from '@/common/queue/queue.service';

@Injectable()
export class AuthService {
  private static googleClient: OAuth2Client | null = null;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly queuService: QueueService,
  ) {
    if (!AuthService.googleClient) {
      AuthService.googleClient = new OAuth2Client();
    }
  }

  private async _hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  private async _hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  private async _checkPassword(checkPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(checkPassword, password);
  }

  private async _checkRefreshToken(
    checkRefreshToken: string,
    refreshToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(checkRefreshToken, refreshToken);
  }

  private async _generateTokens(payload: jwtPayLoad): Promise<TokenResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: processEnv.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: processEnv.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async _verifyRefreshToken(token: string): Promise<jwtPayLoad> {
    return this.jwtService.verifyAsync(token, {
      secret: processEnv.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  private async _saveHashedRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefresh = await this._hashRefreshToken(refreshToken);
    await this.usersService.updateUserRefreshToken(userId, { refreshToken: hashedRefresh });
  }

  async signout(requestBody: SignOutRequestDto) {
    const { refreshToken } = requestBody;

    try {
      const payload = await this._verifyRefreshToken(refreshToken);

      await this.usersService.updateUserRefreshToken(payload.sub, { refreshToken: null });
    } catch (error) {
      this.logger.warn(`Invalid or expired refresh token during logout : ${error}`);
    }

    return { message: 'Logged out (regardless of token validity)' };
  }

  async signup(requestBody: CreateUserRequestDto): Promise<SignupResponse> {
    const { username, email, password } = requestBody;

    const user = await this.usersService.findOneUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email in use');
    }

    const hashedPassword = await this._hashPassword(password);

    const requestData = { username, email, password: hashedPassword };
    const newUser = await this.usersService.createUser(requestData);

    const payload: jwtPayLoad = { sub: newUser.id, email: newUser.email };
    const tokens = await this._generateTokens(payload);

    await this._saveHashedRefreshToken(newUser.id, tokens.refreshToken);

    return { user: newUser, tokens };
  }

  async signin(requestBody: SignInUserRequestDto): Promise<SignupResponse> {
    const { email, password } = requestBody;

    const user = await this.usersService.findOneUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { socialProvider } = user;
    if (socialProvider) {
      throw new BadRequestException('Not available for social login accounts.');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password not set for this user');
    }

    const isPasswordValid = await this._checkPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: jwtPayLoad = { sub: user.id, email: user.email };
    const tokens = await this._generateTokens(payload);

    await this._saveHashedRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  async refreshAccessToken(requestBody: RefreshAccesTokenRequestDto): Promise<TokenResponseDto> {
    const { refreshToken } = requestBody;

    const { sub, email } = await this._verifyRefreshToken(refreshToken);

    const user = await this.usersService.findOneUserById(sub);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('User not found or refresh token missing');
    }

    const isValid = await this._checkRefreshToken(refreshToken, user.refreshToken);
    if (!isValid) {
      await this.usersService.updateUserRefreshToken(user.id, { refreshToken: null });
      throw new ForbiddenException('Refresh token does not match stored token (possible reuse)');
    }

    const payload: jwtPayLoad = { sub, email };
    const tokens = await this._generateTokens(payload);

    await this._saveHashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async _verifyGoogleIdToken(id_token: string): Promise<TokenPayload> {
    try {
      const ticket = await AuthService.googleClient!.verifyIdToken({
        idToken: id_token,
        audience: processEnv.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google ID token');
      }
      return payload;
    } catch (error) {
      this.logger.error(`_verifyGoogleIdToken`, error);
      throw new UnauthorizedException(`Google ID token verification failed: ${error}`);
    }
  }

  async verifyGoogleOAuth(requestBody: VerifyGoogleOAuthRequestDto): Promise<SignupResponse> {
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
      socialProvider: SOCIAL_PROVIDERS.GOOGLE,
    });

    const jwtPayload: jwtPayLoad = { sub: user.id, email: user.email };
    const tokens = await this._generateTokens(jwtPayload);

    await this._saveHashedRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  async resetPassword(requestBody: ResetPasswordRequestDto): Promise<string> {
    const { email } = requestBody;

    const user = await this.usersService.findOneUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { id, socialProvider } = user;
    if (socialProvider) {
      throw new BadRequestException('Not available for social login accounts.');
    }

    const tempPassword = uuidv4().slice(0, 8);
    const hashedPassword = await this._hashPassword(tempPassword);
    await this.usersService.updateUserPassword(id, { password: hashedPassword });

    const subject = `비밀번호 재설정 안내`;
    const text = `임시 비밀번호: ${tempPassword}\n로그인 후 반드시 비밀번호를 변경해주세요.`;
    const jobId = await this.queuService.addMailQueue(email, subject, text);

    return jobId;
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordRequestDto,
  ): Promise<string> {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new UnauthorizedException({
        code: ERROR_CODE.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    const { socialProvider } = user;
    if (socialProvider) {
      throw new BadRequestException('Not available for social login accounts.');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password not set for this user');
    }

    const isPasswordValid = await this._checkPassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ERROR_CODE.INVALID__PASSWORD,
        message: 'Invalid password',
      });
    }

    const hashedPassword = await this._hashPassword(newPassword);
    await this.usersService.updateUserPassword(userId, { password: hashedPassword });

    return 'Password changed successfully';
  }
}
