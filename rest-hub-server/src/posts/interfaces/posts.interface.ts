import { metaDataResponseDto } from '../dtos/posts.response.dto';

import { Post } from '@/model/post.entity';
import { User } from '@/model/user.entity';

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  user: Partial<User>;
  location?: string;
}

export interface GetPaginatedPostsResponse {
  posts: PostWithUserAndIsLiked[];
  meta: metaDataResponseDto;
}

export type PostWithUser = Post & { user: User };

export type PostWithUserAndIsLiked = PostWithUser & { isLiked: boolean };

export interface PostLikeStatusResponse {
  isLiked: boolean;
  likesCount: number;
}
