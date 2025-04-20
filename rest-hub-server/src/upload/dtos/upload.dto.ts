import { IsIn, IsString } from 'class-validator';

import { UploadObjectType } from '../interfaces/upload.interface';

export class GetPresignedUrlRequestDto {
  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsIn(['users/posts', 'users/profile'])
  objectType: UploadObjectType;
}
