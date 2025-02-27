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
  createdAt: Date;

  @Expose()
  updatedAt: Date;
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
