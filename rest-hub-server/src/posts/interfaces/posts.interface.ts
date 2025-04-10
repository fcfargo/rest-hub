import { metaDataResponseDto } from '../dtos/posts.response.dto';

import { Post } from '@/model/post.entity';
import { PostComment } from '@/model/postComment.entity';
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

export interface GetPaginatedPostCommentsResponse {
  comments: PostComment[];
  meta: metaDataResponseDto;
}

export type PostWithUser = Post & { user: User };

export type PostWithUserAndIsLiked = PostWithUser & { isLiked: boolean };

export type PostCommentDetail = PostComment & { user: User } & { post: Post };

export interface PostLikeStatusResponse {
  isLiked: boolean;
  likesCount: number;
}
