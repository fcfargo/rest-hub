import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { processEnv } from './common/constants';
import { ErrorExceptionFilter } from './common/filters/error.exception';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new SuccessInterceptor());

  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new ErrorExceptionFilter(logger));

  const corsOptions = {
    origin: ['http://localhost:3000', processEnv.CLIENT_URL],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  };
  app.enableCors(corsOptions);

  await app.listen(processEnv.PORT ?? 3000);
}
bootstrap();
