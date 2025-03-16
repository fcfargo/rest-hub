import { IsString } from 'class-validator';

export class GetPresignedUrlRequestDto {
  @IsString()
  fileName: string;

  @IsString()
  fileType: string;
}
