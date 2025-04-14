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
  comments: PostCommentDetailAndIsLiked[];
  meta: metaDataResponseDto;
}

export interface GetPaginatedRepliesResponse {
  replies: PostCommentDetailAndIsLiked[];
  meta: metaDataResponseDto;
}

export type PostWithUser = Post & { user: User };

export type PostWithUserAndIsLiked = PostWithUser & { isLiked: boolean };

export type PostCommentDetail = PostComment & { user: User } & { post: Post };

export type PostCommentDetailAndIsLiked = PostCommentDetail & { isLiked: boolean };

export interface PostLikeStatusResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface PostCommentLikeStatusResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface ParentRepliesCount {
  parentRepliesCount: number;
}

export interface CreateReply extends ParentRepliesCount {
  reply: PostComment;
}
