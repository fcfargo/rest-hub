import { UseInterceptors } from '@nestjs/common';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { ClassConstructor } from '../interfaces/common.interface';

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
