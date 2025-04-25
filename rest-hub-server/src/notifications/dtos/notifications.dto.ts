import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class GetNotificationsRequestDto {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsNumber()
  page: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @IsNumber()
  limit: number;
}

export class UpdateNotificationMarkRequestDto {
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  @IsBoolean()
  isRead: boolean;
}
