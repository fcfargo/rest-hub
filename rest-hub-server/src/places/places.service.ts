import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GOOGLE_MAPS_BASEURL } from './\bconstants/constants';
import { GetPlaceAutocompleteResponseDto } from './dtos/places.response.dto';

import { processEnv } from '@/common/constants';

@Injectable()
export class PlacesService {
  private readonly googleMapsApiKey: string;
  private readonly googleMapsBaseUrl = GOOGLE_MAPS_BASEURL;

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    this.googleMapsApiKey = processEnv.GOOGLE_MAPS_API_KEY;
  }

  async getPlaceAutocomplete(input: string): Promise<GetPlaceAutocompleteResponseDto> {
    const requestUrl = `${this.googleMapsBaseUrl}/autocomplete/json`;

    try {
      const { data } = await axios.get(requestUrl, {
        params: {
          input,
          key: this.googleMapsApiKey,
          language: 'ko',
        },
      });

      return data.predictions.map((el: any) => ({
        placeId: el.place_id,
        description: el.description,
      }));
    } catch (error) {
      this.logger.error(`getPlaceAutocomplete`, error);
      throw new InternalServerErrorException(`Google Places API Request failed: ${error}`);
    }
  }
}
