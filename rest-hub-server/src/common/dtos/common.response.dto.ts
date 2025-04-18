import { Expose } from 'class-transformer';

export class CommonMessageResponseDto {
  @Expose()
  message: string;
}

export class MetaDataResponseDto {
  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}
