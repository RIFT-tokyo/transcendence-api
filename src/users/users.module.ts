import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MeController } from './me.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from '../common/interceptor/current-user.interceptor';
import { UserPasswordInterceptor } from '../common/interceptor/user-password.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, UsersService],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserPasswordInterceptor,
    },
  ],
  controllers: [UsersController, MeController],
})
export class UsersModule {}
