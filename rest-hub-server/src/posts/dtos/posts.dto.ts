import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2200)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class GetPostsRequestDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @IsNumber()
  limit: number;
}

export class UpdatePostRequestDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class DeletePostRequestDto {
  @IsString()
  postId: string;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
