import { MetaDataResponseDto } from '@/common/dtos/common.response.dto';
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
  posts: PostWithViewerState[];
  meta: MetaDataResponseDto;
}

export interface GetPaginatedPostCommentsResponse {
  comments: PostCommentDetailViewerState[];
  meta: MetaDataResponseDto;
}

export interface GetPaginatedRepliesResponse {
  replies: PostCommentDetailViewerState[];
  meta: MetaDataResponseDto;
}

export type PostWithUser = Post & { user: User };

export type PostWithViewerState = PostWithUser & {
  isLiked: boolean;
  isFollowing: boolean;
};

export type PostCommentDetail = PostComment & { user: User } & { post: Post };

export type PostCommentDetailViewerState = PostCommentDetail & { isLiked: boolean };

export type PostLikeStatusResponse = {
  isLiked: boolean;
  likesCount: number;
};

export type PostCommentLikeStatusResponse = PostLikeStatusResponse;

export interface ParentRepliesCount {
  parentRepliesCount: number;
}

export interface CreateReplyResponse extends ParentRepliesCount {
  reply: PostComment;
}

export type DeleteReplyResponse = ParentRepliesCount;
