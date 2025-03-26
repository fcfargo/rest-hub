import { metaDataResponseDto } from '../dtos/posts.response.dto';

import { Post } from '@/model/post.entity';
import { User } from '@/model/user.entity';

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  user: User;
  location?: string;
}

export interface getPaginatedPostsResponse {
  posts: PostWithUser[];
  meta: metaDataResponseDto;
}

export type PostWithUser = Post & { user: User };
