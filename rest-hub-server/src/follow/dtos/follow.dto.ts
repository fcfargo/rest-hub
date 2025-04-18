import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class FollowUserRequestDto {
  @IsNotEmpty()
  @IsNumber()
  followingId: number;
}

export class UnfollowUserRequestDto extends FollowUserRequestDto {}

export class IsFollowingRequestDto {
  @IsNotEmpty()
  @IsNumber()
  targetId: number;
}

export class GetFollowersRequestDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @IsNumber()
  limit: number;
}

export class GetFollowingsRequestDto extends GetFollowersRequestDto {}
