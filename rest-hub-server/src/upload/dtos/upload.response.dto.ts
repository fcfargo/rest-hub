import { IsString } from 'class-validator';

export class GetPresignedUrlResponseDto {
  @IsString()
  url: string;
}
