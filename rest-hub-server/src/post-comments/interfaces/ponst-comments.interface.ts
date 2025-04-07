export interface CreatePostCommentRequest {
  postId: string;
  userId: number;
  content: string;
  parentId?: string;
}
