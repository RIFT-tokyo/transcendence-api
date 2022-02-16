import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follow.entity';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FollowsService } from '../follows/follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  exports: [TypeOrmModule, UsersService],
  providers: [UsersService, FollowsService],
  controllers: [UsersController],
})
export class UsersModule {}
