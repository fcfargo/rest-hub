import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateUserRequestDto extends SignInUserRequestDto {
  @IsString()
  username: string;
}

export class RefreshAccesTokenRequestDto {
  @IsString()
  refreshToken: string;
}

export class VerifyGoogleOAuthRequestDto {
  @IsString()
  id_token: string;
}

export class ResetPasswordRequestDto {
  @IsEmail()
  email: string;
}

export class ChangePasswordRequestDto {
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
