import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { GetPresignedUrlRequestDto } from './dtos/upload.dto';
import { GetPresignedUrlResponseDto } from './dtos/upload.response.dto';
import { UploadService } from './upload.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Serialize(GetPresignedUrlResponseDto)
  @Get('presigned-url')
  async getPresignedUrl(@Query() query: GetPresignedUrlRequestDto) {
    return this.uploadService.getPresignedUrl(query);
  }
}
