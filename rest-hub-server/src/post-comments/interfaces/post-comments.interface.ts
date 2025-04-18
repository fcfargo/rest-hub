import { PostCommentDetailViewerState } from '@/posts/interfaces/posts.interface';

export interface CreatePostCommentRequest {
  postId: string;
  userId: number;
  content: string;
  parentId?: string;
}

export interface GetPaginatedPostCommentsByPostIdResponse {
  comments: PostCommentDetailViewerState[];
  totalCount: number;
}

export interface GetPaginatedRepliesByPostIdAndCommentIdResponse {
  replies: PostCommentDetailViewerState[];
  totalCount: number;
}
