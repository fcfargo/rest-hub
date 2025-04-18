import { Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  profileImage: string;

  @Expose()
  deviceToken: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  socialProvider: string;

  @Expose()
  followingsCount: number;

  @Expose()
  followersCount: number;
}

export class TokenResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class AuthResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => TokenResponseDto)
  tokens: TokenResponseDto;
}

export class UserSummaryResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId: string;

  @Expose()
  profileImage: string;
}
