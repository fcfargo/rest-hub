import { MetaDataResponseDto } from '@/common/dtos/common.response.dto';
import { UserSummary } from '@/users/interfaces/users.interface';

export interface FollowUserRequest {
  followerId: number;
  followingId: number;
}

export type UnfollowUserRequest = FollowUserRequest;

export interface IsFollowingResponse {
  isFollowing: boolean;
}

export interface PaginatedFollowersRawResponse {
  followers: UserSummary[];
  totalCount: number;
}

export interface GetPaginatedFollowersResponse {
  followers: UserSummary[];
  meta: MetaDataResponseDto;
}

export interface PaginatedFollowingsRawResponse {
  followings: UserSummary[];
  totalCount: number;
}

export interface GetPaginatedFollowingsResponse {
  followings: UserSummary[];
  meta: MetaDataResponseDto;
}
