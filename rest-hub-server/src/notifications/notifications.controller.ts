import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';

import {
  GetNotificationsRequestDto,
  UpdateNotificationMarkRequestDto,
} from './dtos/notifications.dto';
import { GetPaginatedUserNotificationsResponseDto } from './dtos/notifications.response';
import { NotificationsService } from './notifications.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { CommonMessageResponseDto } from '@/common/dtos/common.response.dto';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';
import { jwtPayLoad } from '@/users/jwt/guards/jwt.payload';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Serialize(GetPaginatedUserNotificationsResponseDto)
  @Get()
  async getNotifications(
    @CurrentUser() currentUser: jwtPayLoad,
    @Query() query: GetNotificationsRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.notificationsService.getPaginatedUserNotifications(userId, query);
  }

  @Serialize(CommonMessageResponseDto)
  @Patch(':notificationId/read')
  async markAsRead(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('notificationId') notificationId: number,
    @Body() requestData: UpdateNotificationMarkRequestDto,
  ) {
    const userId = currentUser.sub;
    return this.notificationsService.markAsRead(userId, Number(notificationId), requestData);
  }

  @Serialize(CommonMessageResponseDto)
  @Delete(':notificationId')
  async deleteNotification(
    @CurrentUser() currentUser: jwtPayLoad,
    @Param('notificationId') notificationId: number,
  ) {
    const userId = currentUser.sub;
    return this.notificationsService.deleteNotification(userId, Number(notificationId));
  }
}
