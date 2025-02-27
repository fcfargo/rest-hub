import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

import { processEnv } from '@/common/constants';
import { User } from '@/model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: processEnv.JWT_SECRET,
        signOptions: {
          expiresIn: processEnv.ACCESS_TOKEN_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthService],
})
export class UsersModule {}
