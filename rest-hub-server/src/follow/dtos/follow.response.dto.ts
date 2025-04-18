import { Expose, Type } from 'class-transformer';

import { MetaDataResponseDto } from '@/common/dtos/common.response.dto';
import { UserSummaryResponseDto } from '@/users/dtos/users.response.dto';

export class FollowResponseDto {
  @Expose()
  id: string;

  @Expose()
  followerId: number;

  @Expose()
  followingId: string;

  @Expose()
  createdAt: string;
}

export class IsFollowingResponseDto {
  @Expose()
  isFollowing: boolean;
}

export class GetPaginatedFollowersResponseDto {
  @Expose()
  @Type(() => UserSummaryResponseDto)
  followers: UserSummaryResponseDto;

  @Expose()
  meta: MetaDataResponseDto;
}

export class GetPaginatedFollowingsResponseDto {
  @Expose()
  @Type(() => UserSummaryResponseDto)
  followings: UserSummaryResponseDto;

  @Expose()
  meta: MetaDataResponseDto;
}
