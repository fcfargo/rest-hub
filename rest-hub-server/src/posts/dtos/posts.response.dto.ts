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
  @Type(() => PostUserResponseDto)
  user: PostUserResponseDto;

  @Expose()
  createdAt: string;
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

export class CommonMessageResponseDto {
  @Expose()
  message: string;
}
