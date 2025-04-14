import { PostCommentDetailAndIsLiked } from '@/posts/interfaces/posts.interface';

export interface CreatePostCommentRequest {
  postId: string;
  userId: number;
  content: string;
  parentId?: string;
}

export interface GetPaginatedPostCommentsByPostIdResponse {
  comments: PostCommentDetailAndIsLiked[];
  totalCount: number;
}

export interface GetPaginatedRepliesByPostIdAndCommentIdResponse {
  replies: PostCommentDetailAndIsLiked[];
  totalCount: number;
}
