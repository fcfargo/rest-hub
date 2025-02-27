import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm.config';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { processEnv } from './common/constants';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config/.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: processEnv.NODE_ENV === 'production' ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('rest-hub-server'),
          ),
        }),
      ],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_INTERCEPTOR', useClass: LoggingInterceptor }],
})
export class AppModule {}
