import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follow.entity';
import { User } from 'src/entities/user.entity';
import { FollowsService } from './follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  exports: [TypeOrmModule],
  providers: [FollowsService],
})
export class FollowsModule {}
