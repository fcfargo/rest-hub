import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class SignInUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class RefreshAccesTokenRequestDto {
  @IsString()
  refreshToken: string;
}

export class VerifyGoogleOAuthRequestDto {
  @IsString()
  id_token: string;
}
