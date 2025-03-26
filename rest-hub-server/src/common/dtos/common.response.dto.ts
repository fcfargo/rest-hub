import { Expose } from 'class-transformer';

export class CommonMessageResponseDto {
  @Expose()
  message: string;
}
