import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { GetPlaceAutocompleteRequestDto } from './dtos/places.dto';
import { GetPlaceAutocompleteResponseDto } from './dtos/places.response.dto';
import { PlacesService } from './places.service';

import { Serialize } from '@/common/decorators/serialize.decorator';
import { JwtAuthGuard } from '@/users/jwt/guards/jwt.guard';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Serialize(GetPlaceAutocompleteResponseDto)
  @UseGuards(JwtAuthGuard)
  @Get('autocomplete')
  getPlaceAutocomplete(@Query() query: GetPlaceAutocompleteRequestDto) {
    return this.placesService.getPlaceAutocomplete(query.input);
  }
}
