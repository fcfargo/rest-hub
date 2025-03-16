import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

import { QueueModule } from '@/common/queue/queue.module';
import { User } from '@/model/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), QueueModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
