import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

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
