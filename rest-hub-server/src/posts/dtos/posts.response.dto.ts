import { Expose, Type } from 'class-transformer';

export class PostUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  profileImage: string;
}

export class PostResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: number;

  @Expose()
  imageUrl: string;

  @Expose()
  location: string;

  @Expose()
  likesCount: number;

  @Expose()
  commentsCount: number;

  @Expose()
  @Type(() => PostUserResponseDto)
  user: PostUserResponseDto;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  isLiked: boolean;
}

export class PostSummaryResponseDto {
  @Expose()
  id: string;

  @Expose()
  commentsCount: number;
}

export class PostCommentResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  parentId: string | null;

  @Expose()
  @Type(() => PostUserResponseDto)
  user: PostUserResponseDto;

  @Expose()
  @Type(() => PostSummaryResponseDto)
  post: PostSummaryResponseDto;

  @Expose()
  likesCount: number;

  @Expose()
  children: Comment[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  isLiked: boolean;
}

export class metaDataResponseDto {
  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}

export class GetPostsResponseDto {
  @Expose()
  @Type(() => PostResponseDto)
  posts: PostResponseDto[];

  @Expose()
  @Type(() => metaDataResponseDto)
  meta: metaDataResponseDto;
}

export class GetPostCommentsResponseDto {
  @Expose()
  @Type(() => PostCommentResponseDto)
  comments: PostCommentResponseDto[];

  @Expose()
  @Type(() => metaDataResponseDto)
  meta: metaDataResponseDto;
}

export class CommonMessageResponseDto {
  @Expose()
  message: string;
}

export class PostLikeStatusResponseDto {
  @Expose()
  isLiked: boolean;

  @Expose()
  likesCount: number;
}

export class PostCommentLikeStatusResponseDto {
  @Expose()
  isLiked: boolean;

  @Expose()
  likesCount: number;
}
