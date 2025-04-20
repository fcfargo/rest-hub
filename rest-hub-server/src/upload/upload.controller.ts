import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { GetPresignedUrlRequestDto } from './dtos/upload.dto';
import { GetPresignedUrlResponseDto } from './dtos/upload.response.dto';
import { UploadService } from './upload.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';
import { jwtPayLoad } from '@/users/jwt/guards/jwt.payload';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Serialize(GetPresignedUrlResponseDto)
  @Get('presigned-url')
  async getPresignedUrl(
    @CurrentUser() currentUser: jwtPayLoad,
    @Query() query: GetPresignedUrlRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.uploadService.getPresignedUrl(userId, query);
  }
}
