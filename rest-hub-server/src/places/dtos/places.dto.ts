import { IsString } from 'class-validator';

export class GetPlaceAutocompleteRequestDto {
  @IsString()
  input: string;
}
