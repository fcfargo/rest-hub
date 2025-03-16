import { Expose } from 'class-transformer';

export class GetPlaceAutocompleteResponseDto {
  @Expose()
  placeId: string;

  @Expose()
  description: string;
}
