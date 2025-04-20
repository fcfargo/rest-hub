import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetPresignedUrlRequestDto } from './dtos/upload.dto';

import { processEnv } from '@/common/constants';

@Injectable()
export class UploadService {
  private static s3Client: S3Client | null = null;

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    if (!UploadService.s3Client) {
      UploadService.s3Client = new S3Client({ region: processEnv.AWS_REGION });
    }
  }

  async getPresignedUrl(
    userId: number,
    { fileName, fileType, objectType }: GetPresignedUrlRequestDto,
  ): Promise<string> {
    try {
      const key = this.getUploadKey(objectType, fileName, userId);

      const command = new PutObjectCommand({
        Bucket: processEnv.AWS_BUCKET,
        Key: key,
        ContentType: fileType,
      });

      const url = await getSignedUrl(UploadService.s3Client!, command, { expiresIn: 60 });

      return url;
    } catch (error) {
      this.logger.error('getPresignedUrl', error);
      throw new InternalServerErrorException(`Failed to generate Presigned URL: ${error} `);
    }
  }

  private getUploadKey(objectType: string, fileName: string, userId?: number): string {
    const env = processEnv.UPLOAD_ENV || 'dev';

    if (userId && objectType.startsWith('users')) {
      return `uploads/${env}/${objectType}/${userId}/${fileName}`;
    }

    return `uploads/${env}/${objectType}/${fileName}`;
  }
}
