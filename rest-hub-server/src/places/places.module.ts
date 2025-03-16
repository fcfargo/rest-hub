import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

import { User } from '@/model/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
