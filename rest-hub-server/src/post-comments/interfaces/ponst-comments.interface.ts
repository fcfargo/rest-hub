import { PostComment } from '@/model/postComment.entity';

export interface CreatePostCommentRequest {
  postId: string;
  userId: number;
  content: string;
  parentId?: string;
}

export interface GetPaginatedPostCommentsResponse {
  comments: PostComment[];
  totalCount: number;
}
