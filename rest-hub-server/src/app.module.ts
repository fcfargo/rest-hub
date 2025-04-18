import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm.config';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { processEnv } from './common/constants';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { FollowModule } from './follow/follow.module';
import { PlacesModule } from './places/places.module';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';
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
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: processEnv.REDIS_HOST,
          port: Number(processEnv.REDIS_PORT),
        },
      }),
    }),
    JwtModule.register({
      global: true,
      secret: processEnv.JWT_SECRET,
      signOptions: {
        expiresIn: processEnv.ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
    UsersModule,
    PlacesModule,
    UploadModule,
    PostsModule,
    PostCommentsModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_INTERCEPTOR', useClass: LoggingInterceptor }],
})
export class AppModule {}
