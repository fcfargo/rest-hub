import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignInUserRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateUserRequestDto extends SignInUserRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class RefreshAccesTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class VerifyGoogleOAuthRequestDto {
  @IsNotEmpty()
  @IsString()
  id_token: string;
}

export class ResetPasswordRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ChangePasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class UpdateUserProfileRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
