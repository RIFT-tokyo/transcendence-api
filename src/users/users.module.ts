import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
